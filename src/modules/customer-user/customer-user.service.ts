import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'

import { Brackets, EntityManager, Repository } from 'typeorm'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Profile } from 'passport'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { uuid } from 'uuidv4'

import { AdminService } from '@app/admin'
import { AwsS3ClientService } from '@app/aws-s3-client'
import {
  ForgotPasswordInput,
  JWT_STRATEGY_NAME,
  JwtDto,
  ResetForgotPasswordInput,
  SocialProviderTypes,
  SuccessResponse,
  comparePassword,
  encodePassword,
  generateOTP,
  isValidPassword
} from '@app/common'
import { MailService } from '@app/mail'
import { PaymentService } from '@app/payment'
import { SocialProvider } from '@app/common/entities'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'

import {
  CreateCustomerInput,
  CreateOrganizerInput,
  ListCustomersInputs,
  LoginCustomerInput,
  UpdateOrganizerInput
} from './dto/inputs'
import { Customer, CustomerFollower, Organizer } from './entities'
import {
  CustomerEmailUpdateResponse,
  CustomerLoginOrRegisterResponse,
  CustomerWithoutPasswordResponse
} from './dto/args'

@Injectable()
export class CustomerUserService {
  constructor(
    private adminService: AdminService,
    private configService: ConfigService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerFollower)
    private customerFollowerRepository: Repository<CustomerFollower>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private mailService: MailService,
    @InjectRepository(Organizer)
    private organizerRepository: Repository<Organizer>,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    private jwtService: JwtService,
    private s3Service: AwsS3ClientService,
    @InjectRepository(SocialProvider)
    private socialProviderRepository: Repository<SocialProvider>
  ) {}

  // Private Methods

  private async checkEmailExist(email: string): Promise<boolean> {
    if (!email) throw new BadRequestException('Customer Email is invalid')
    const checkCustomerEmail = await this.customerRepository.count({
      where: { email }
    })
    if (checkCustomerEmail > 1) return true

    return false
  }

  private async handleCustomerLogin(
    customer: Partial<Customer>
  ): Promise<CustomerLoginOrRegisterResponse> {
    if (customer.id && customer.email && customer.firstName && customer.lastName) {
      const payload: JwtDto = {
        email: customer.email,
        sub: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        profileImage: customer.profileImage,
        type: JWT_STRATEGY_NAME.CUSTOMER
      }

      return {
        accessToken: await this.getJwtToken(payload),
        user: customer
      }
    } else {
      throw new BadRequestException('Token failed to create')
    }
  }

  private async updateFollowerCounts(
    transactionalManager: EntityManager,
    currentUserId: string,
    userToFollow: Customer,
    method: string
  ): Promise<void> {
    const currentUserFollowing = await this.getCustomerById(currentUserId)
    try {
      const { totalFollowers } = userToFollow
      const { totalFollowings } = currentUserFollowing

      if (method === 'follow') {
        await transactionalManager.update(Customer, userToFollow.id, {
          totalFollowers: Number(totalFollowers || 0) + 1
        })
        await transactionalManager.update(Customer, currentUserFollowing.id, {
          totalFollowings: Number(totalFollowings || 0) + 1
        })
      } else if (method === 'unfollow') {
        await transactionalManager.update(Customer, userToFollow.id, {
          totalFollowers: Math.max(Number(totalFollowers || 0) - 1, 0)
        })
        await transactionalManager.update(Customer, currentUserFollowing.id, {
          totalFollowings: Math.max(Number(totalFollowings || 0) - 1, 0)
        })
      } else throw new BadRequestException('Invalid method.')
    } catch (error) {
      throw new BadRequestException('Error updating following counts.')
    }
  }

  // Public Methods

  async existsBySocialId(socialId: string, provider: SocialProviderTypes): Promise<number> {
    const count = await this.socialProviderRepository.count({ where: { socialId, provider } })

    return count
  }

  async findOneBySocialId(socialId: string): Promise<SocialProvider> {
    const findsocialProviderById = await this.socialProviderRepository.findOne({
      where: { socialId }
    })
    if (!findsocialProviderById)
      throw new BadRequestException('Social Provider with the provided ID does not exist')

    return findsocialProviderById
  }

  async forgotPassword(email: string): Promise<Customer> {
    const customer = await this.getCustomerByEmail(email)

    if (customer.socialProvider)
      throw new BadRequestException('Social Provider with the provided ID does not exist')
    return customer
  }

  async getAllCustomers(userId: string): Promise<Partial<CustomerWithoutPasswordResponse[]>> {
    const isAdmin = await this.adminService.getAdminById(userId)

    if (!isAdmin) throw new ForbiddenException('Only admin can access this data.')

    const customersData: Partial<Customer>[] = await this.customerRepository.find()

    const customersWithoutPasswords: Partial<CustomerWithoutPasswordResponse>[] = customersData.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...rest }) => rest
    )
    return customersWithoutPasswords
  }

  async getCustomerByEmail(email: string): Promise<Customer> {
    if (!email) throw new BadRequestException('Customer Email is invalid')
    const findCustomerByEmail = await this.customerRepository.findOne({
      where: { email, isActive: true }
    })
    if (!findCustomerByEmail)
      throw new NotFoundException('Customer with the provided email does not exist')

    return findCustomerByEmail
  }

  getJwtToken = async ({ sub, email, firstName, lastName, profileImage, type }: JwtDto) => {
    const payload: JwtDto = { sub, email, firstName, lastName, profileImage, type }
    return this.jwtService.sign(payload)
  }

  async getOrganizerByName(name: string, customerId: string): Promise<Organizer> {
    const findOrganizerByName = await this.organizerRepository.findOne({
      where: { name, isActive: true, createdBy: customerId }
    })
    if (!findOrganizerByName)
      throw new BadRequestException('Organizer with the provided Name does not exist')
    return findOrganizerByName
  }

  async getOrganizerById(id: string, customerId: string): Promise<Organizer> {
    const findOrganizerById = await this.organizerRepository.findOne({
      where: { id, isActive: true, createdBy: customerId }
    })
    if (!findOrganizerById)
      throw new BadRequestException('Organizer with the provided ID does not exist')
    return findOrganizerById
  }

  async isValidPwd(pwd: string): Promise<boolean> {
    const checkPwd = isValidPassword(pwd)

    if (!checkPwd) throw new BadRequestException('Invalid email or password')
    return true
  }

  async updateStripeId(stripeCustomerId: string, customerId: string): Promise<Customer> {
    const customerData = await this.getCustomerById(customerId)
    try {
      await this.customerRepository.update(customerData.id, {
        stripeCustomerId,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }
    return customerData
  }

  async saveProviderAndCustomer(customer: Partial<Customer>, provider: Partial<SocialProvider>) {
    return this.entityManager.transaction(async transactionalManager => {
      const createdCustomer = transactionalManager.create(Customer, customer)
      const savedCustomer = await transactionalManager.save(createdCustomer)
      await transactionalManager.save(SocialProvider, {
        customer: savedCustomer,
        ...provider
      })
      return savedCustomer
    })
  }

  async validateCustomer(email: string, password: string): Promise<any> {
    const user = await this.getCustomerByEmail(email)
    const isValidPwd = await this.validatePassword(password, user?.password)
    if (isValidPwd) return user
    throw new BadRequestException('Invalid email or password')
  }

  async validatePassword(pwd: string, dbPwd: string): Promise<boolean> {
    // await this.isValidPwd(pwd)
    const isValidPwd = pwd && (await comparePassword(pwd, dbPwd))

    if (!isValidPwd) return false
    return true
  }

  // Resolver Query Methods

  async findAllCustomersWithPagination({
    limit,
    offset,
    filter
  }: ListCustomersInputs): Promise<[Customer[], number]> {
    const { email, search } = filter || {}

    try {
      const queryBuilder = this.customerRepository.createQueryBuilder('customer_user')

      email && queryBuilder.andWhere('customer_user.email = :email', { email })

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(customer_user.firstName) LIKE LOWER(:search)', {
              search: `%${search}%`
            })
              .orWhere('LOWER(customer_user.lastName) LIKE LOWER(:search)', {
                search: `%${search}%`
              })
              .orWhere('LOWER(customer_user.email) LIKE LOWER(:search)', {
                search: `%${search}%`
              })
          })
        )
      }

      const [customers, total] = await queryBuilder
        .leftJoinAndSelect('customer_user.followers', 'followers')
        .leftJoinAndSelect('customer_user.following', 'following')
        .take(limit)
        .skip(offset)
        .getManyAndCount()

      return [customers, total]
    } catch (error) {
      throw new BadRequestException('Failed to find Users')
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    if (!id) throw new BadRequestException('Customer Id is invalid')
    const findCustomerById = await this.customerRepository.findOne({
      where: { id, isActive: true }
    })
    if (!findCustomerById)
      throw new BadRequestException('Customer with the provided ID does not exist')

    return findCustomerById
  }

  async getCustomerUploadUrl(): Promise<S3SignedUrlResponse> {
    const key = `user_profile_image_uploads/${uuid()}-user-profile`
    const bucketName = this.configService.get('USER_UPLOADS_BUCKET')

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key
    })
    const url = await getSignedUrl(this.s3Service.getClient(), command, {
      expiresIn: 3600
    })
    return {
      signedUrl: url,
      fileName: key
    }
  }

  async getFollowers(customerId: string): Promise<Customer[]> {
    try {
      const followers = await this.customerFollowerRepository.find({
        where: { following: { id: customerId } },
        relations: ['followers']
      })
      return followers.map(follower => follower.followers)
    } catch (error) {
      throw new BadRequestException('Failed to find Users')
    }
  }

  async getFollowing(customerId: string): Promise<Customer[]> {
    try {
      const following = await this.customerFollowerRepository.find({
        where: { followers: { id: customerId } },
        relations: ['following']
      })
      return following.map(followTo => followTo.following)
    } catch (error) {
      throw new BadRequestException('Failed to find Users')
    }
  }

  async isFollowing(currentUserId: string, otherCustomerId: string): Promise<boolean> {
    const followRelationship = await this.customerFollowerRepository.findOne({
      where: { followers: { id: currentUserId }, following: { id: otherCustomerId } }
    })
    return !!followRelationship
  }

  async searchCustomers(search: string): Promise<[Customer[], number]> {
    try {
      const queryBuilder = this.customerRepository.createQueryBuilder('customer_user')

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(customer_user.firstName) LIKE LOWER(:search)', {
              search: `%${search}%`
            })
              .orWhere('LOWER(customer_user.lastName) LIKE LOWER(:search)', {
                search: `%${search}%`
              })
              .orWhere('LOWER(customer_user.email) LIKE LOWER(:search)', {
                search: `%${search}%`
              })
          })
        )
      }

      const [customers, total] = await queryBuilder.getManyAndCount()

      return [customers, total]
    } catch (error) {
      throw new BadRequestException('Failed to find Users')
    }
  }

  // Resolver Mutation Methods

  async loginCustomer(
    loginCustomerInput: LoginCustomerInput,
    user: any
  ): Promise<CustomerLoginOrRegisterResponse> {
    const payload = {
      email: loginCustomerInput?.email,
      sub: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profileImage: user?.profileImage,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }
    return {
      accessToken: await this.getJwtToken(payload),
      user: user
    }
  }

  async continueWithSocialSite(
    profile: Profile,
    provider: SocialProviderTypes
  ): Promise<CustomerLoginOrRegisterResponse> {
    const email = profile.emails![0].value
    const firstName = profile.name?.givenName
    const lastName = profile.name?.familyName
    const socialId = profile.id

    const socialLoginById = await this.existsBySocialId(socialId, provider)

    if (socialLoginById) {
      const customer = await this.getCustomerByEmail(email)
      return this.handleCustomerLogin(customer)
    }

    const checkCustomerEmail = await this.checkEmailExist(email)
    if (checkCustomerEmail)
      throw new BadRequestException('User is already registered with other account')

    const name = `${firstName} ${lastName}`
    try {
      const stripeCustomer = await this.paymentService.createStripeCustomer(name, email)
      const randomPassword = await randomStringGenerator()
      const pwd = await encodePassword(randomPassword)
      const customer: Partial<Customer> = await this.saveProviderAndCustomer(
        { email, firstName, lastName, password: pwd, stripeCustomerId: stripeCustomer.id },
        { provider, socialId }
      )

      return this.handleCustomerLogin(customer)
    } catch (err) {
      throw new BadRequestException('User addition transaction failed')
    }
  }

  async createCustomer(data: CreateCustomerInput): Promise<CustomerLoginOrRegisterResponse> {
    const { email, firstName, lastName } = data
    const name = firstName.concat(' ').concat(lastName)

    const stripeCustomer = await this.paymentService.createStripeCustomer(name, email)

    const user = await this.customerRepository.findOne({ where: { email } })
    if (user) throw new BadRequestException('Email already exists')

    const password = await encodePassword(data.password)

    const currentUser = await this.customerRepository.save({
      ...data,
      password,
      isActive: true,
      stripeCustomerId: stripeCustomer.id
    })

    if (!currentUser) throw new BadRequestException('User not registered')

    return this.handleCustomerLogin(currentUser)
  }

  async createOrganizer(
    organizerInput: CreateOrganizerInput,
    customerId: string
  ): Promise<SuccessResponse> {
    await this.getCustomerById(customerId)
    const organizerData = await this.getOrganizerByName(organizerInput.name, customerId)
    if (organizerData)
      throw new BadRequestException('This organizer already exist. Enter a valid name')

    try {
      await this.organizerRepository.save({
        ...organizerInput,
        createdBy: customerId
      })
    } catch (err) {
      throw new BadRequestException("Couldn't create organizer")
    }

    return { success: true, message: 'Organizer has been created' }
  }

  async followCustomer(currentUserId: string, customerId: string): Promise<SuccessResponse> {
    const userToFollow = await this.getCustomerById(customerId)

    const checkFollowerExistbyId = await this.isFollowing(currentUserId, customerId)

    if (checkFollowerExistbyId) throw new BadRequestException('Already following.')

    return this.entityManager.transaction(async transactionalManager => {
      await transactionalManager.save(CustomerFollower, {
        followers: { id: currentUserId },
        following: { id: customerId }
      })

      await this.updateFollowerCounts(transactionalManager, currentUserId, userToFollow, 'follow')

      return { success: true, message: 'Following successfully' }
    })
  }

  async saveMediaUrl(userId: string, fileName: string): Promise<boolean> {
    const updateMediaUrl = await this.updateCustomerData(
      {
        profileImage: fileName
      },
      userId
    )
    const isUpdatedMedia = updateMediaUrl?.id ? true : false
    if (isUpdatedMedia) return true
    return false
  }

  async unfollowCustomer(currentUserId: string, otherCustomerId: string): Promise<SuccessResponse> {
    const userToFollow = await this.getCustomerById(otherCustomerId)

    const followRelationship = await this.customerFollowerRepository.findOne({
      where: { followers: { id: currentUserId }, following: { id: otherCustomerId } }
    })

    if (!followRelationship) throw new NotFoundException('Not following.')
    return this.entityManager.transaction(async transactionalManager => {
      await transactionalManager.remove(followRelationship)

      await this.updateFollowerCounts(transactionalManager, currentUserId, userToFollow, 'unfollow')

      return { success: true, message: 'Unfollowed successfully' }
    })
  }

  async updateCustomerData(
    customerInput: Partial<Customer>,
    customerId: string
  ): Promise<Partial<Customer>> {
    const customerData = await this.getCustomerById(customerId)

    try {
      await this.customerRepository.update(customerData.id, {
        ...customerInput,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    const updatedCustomerData = await this.getCustomerById(customerId)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedCustomerData

    return rest
  }

  async updateCustomerEmail(userId: string, email: string): Promise<CustomerEmailUpdateResponse> {
    try {
      const customerData: Partial<Customer> = await this.getCustomerByEmail(email)
      if (customerData.id) {
        await this.customerRepository.update(customerData.id, {
          email,
          updatedDate: new Date()
        })
      }

      const updatedCustomerData: Partial<Customer> = await this.getCustomerById(userId)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedCustomerData
      if (
        updatedCustomerData.id &&
        updatedCustomerData.email &&
        updatedCustomerData.firstName &&
        updatedCustomerData.lastName
      ) {
        const payload: JwtDto = {
          email: updatedCustomerData.email,
          sub: updatedCustomerData.id,
          firstName: updatedCustomerData.firstName,
          lastName: updatedCustomerData.lastName,
          profileImage: updatedCustomerData.profileImage,
          type: JWT_STRATEGY_NAME.ADMIN
        }

        return {
          accessToken: await this.getJwtToken(payload),
          user: rest
        }
      } else throw new BadRequestException("Couldn't update email")
    } catch (err) {
      throw new BadRequestException("Couldn't update email")
    }
  }

  async updateOrganizerData(
    organizerInput: UpdateOrganizerInput,
    customerId: string
  ): Promise<Partial<Organizer>> {
    await this.getCustomerById(customerId)
    const organizerData = await this.getOrganizerById(organizerInput.id, customerId)
    if (!organizerData)
      throw new BadRequestException('Organizer with the provided ID does not exist')
    try {
      await this.organizerRepository.update(organizerData.id, {
        ...organizerInput,
        updatedBy: customerId,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    const updatedOrganizerData = await this.getOrganizerById(organizerInput.id, customerId)

    return updatedOrganizerData
  }

  async updatePassword(password: string, customerId: string): Promise<SuccessResponse> {
    const customerData = await this.getCustomerById(customerId)

    // const checkPwd = await isValidPassword(password)
    // if (!checkPwd) {
    //   throw new BadRequestException('Invalid username or password')
    // }

    try {
      const pwd = await encodePassword(password)

      await this.customerRepository.update(customerData.id, {
        password: pwd,
        updatedBy: customerId,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update customer data')
    }
    return { success: true, message: 'Password of customer has been updated' }
  }

  async sendEmailForgotPassword(
    forgotPasswordInput: ForgotPasswordInput
  ): Promise<SuccessResponse> {
    const { email } = forgotPasswordInput || {}

    const customer = await this.forgotPassword(email)
    const code = generateOTP()
    const encodedCode = await encodePassword(code)

    try {
      await this.mailService.sendForgotPasswordEmail(customer.email, customer.firstName, code)
      await this.customerRepository.update(customer.id, {
        resetPaswordOTP: encodedCode,
        updatedBy: customer.id,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to send forgot Email')
    }
    return { success: true, message: 'Forgot Email send' }
  }

  async resetPasswordCustomer(
    resetForgotPasswordInput: ResetForgotPasswordInput
  ): Promise<SuccessResponse> {
    const { email, code, password } = resetForgotPasswordInput || {}
    const customer = await this.forgotPassword(email)

    if (customer?.resetPaswordOTP) {
      const isValidCode = await this.validatePassword(code, customer.resetPaswordOTP)
      if (!isValidCode) throw new BadRequestException('OTP Code is Invalid')
    }

    try {
      const pwd = await encodePassword(password)
      await this.customerRepository.update(customer.id, {
        password: pwd,
        updatedBy: customer.id,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update customer password')
    }
    return { success: true, message: 'Password of customer has been updated' }
  }
}
