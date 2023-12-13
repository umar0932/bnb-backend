import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'
import { uuid } from 'uuidv4'

import { AwsS3ClientService } from '@app/aws-s3-client'
import {
  JWT_STRATEGY_NAME,
  JwtDto,
  JwtUserPayload,
  SuccessResponse,
  comparePassword,
  encodePassword,
  isValidPassword
} from '@app/common'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'

import { Admin } from '@app/admin/entities'
import { CreateCustomerInput, LoginCustomerInput } from './dto/inputs'
import { Customer } from './entities/customer.entity'
import { CustomerEmailUpdateResponse, CustomerLoginResponse } from './dto/args'
import { CreateOrganizerInput } from './dto/inputs/create-organizer.input'
import { Organizer } from './entities/organizer.entity'
import { UpdateOrganizerInput } from './dto/inputs/update-organizer.input'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'

@Injectable()
export class CustomerUserService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private configService: ConfigService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Organizer)
    private organizerRepository: Repository<Organizer>,
    private jwtService: JwtService,
    private s3Service: AwsS3ClientService
  ) {}

  async validateCustomer(email: string, password: string): Promise<any> {
    const user = await this.customerRepository.findOne({ where: { email } })
    if (!user) throw new NotFoundException('Invalid email or password')
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

  async isValidPwd(pwd: string): Promise<boolean> {
    const checkPwd = isValidPassword(pwd)

    if (!checkPwd) throw new BadRequestException('Invalid email or password')
    return true
  }

  async getCustomerById(id: string): Promise<Customer> {
    if (!id) throw new BadRequestException('Id is invalid')
    try {
      const findCustomer = await this.customerRepository.findOne({ where: { id, isActive: true } })
      if (!findCustomer)
        throw new BadRequestException('Unable to find the customer. Please enter valid customer id')

      return findCustomer
    } catch (e) {
      throw new BadRequestException('Failed to fetch customer. Check the customerID')
    }
  }

  async getOrganizerByName(name: string, customerId: string): Promise<Organizer> {
    const findOrganizer = await this.organizerRepository.findOne({
      where: { name, isActive: true, createdBy: customerId }
    })
    if (!findOrganizer)
      throw new BadRequestException('Unable to find the organizer. Please enter valid input ')
    return findOrganizer
  }

  async getOrganizerById(idOrganizerUser: string, customerId: string): Promise<Organizer> {
    const findOrganizer = await this.organizerRepository.findOne({
      where: { idOrganizerUser, isActive: true, createdBy: customerId }
    })
    if (!findOrganizer)
      throw new BadRequestException('Unable to find the organizer. Please enter valid input')
    return findOrganizer
  }

  async isEmailExist(email: string): Promise<SuccessResponse> {
    const emailExists = await this.customerRepository.count({ where: { email } })
    if (emailExists > 0) return { success: true, message: 'Email is valid' }

    return { success: false, message: 'Email is invalid' }
  }

  async login(
    loginCustomerInput: LoginCustomerInput,
    user: JwtUserPayload
  ): Promise<CustomerLoginResponse> {
    const payload = {
      email: loginCustomerInput?.email,
      sub: user?.userId,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }
    return {
      access_token: await this.getJwtToken(payload),
      user: user
    }
  }

  async create(data: CreateCustomerInput): Promise<CustomerLoginResponse> {
    const { email } = data

    const user = await this.customerRepository.findOne({ where: { email } })
    if (user) throw new BadRequestException('Email already exists')

    const password = await encodePassword(data.password)

    const currentUser = await this.customerRepository.save({
      ...data,
      password
    })

    const payload = {
      sub: currentUser?.id,
      email: currentUser?.email,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }

    return {
      access_token: await this.getJwtToken(payload),
      user: currentUser
    }
  }

  getJwtToken = async ({ sub, email, type }: JwtDto) => {
    const payload: JwtDto = { email, sub, type }
    return await this.jwtService.sign(payload)
  }

  async getAllCustomers(userId: string): Promise<Customer[]> {
    const isAdmin = await this.adminRepository.findOne({
      where: { idAdminUser: userId }
    })

    if (!isAdmin) throw new ForbiddenException('Only admin can access this data.')

    return await this.customerRepository.find()
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

  async updatePassword(password: string, customerId: string): Promise<SuccessResponse> {
    const customerData = await this.getCustomerById(customerId)
    if (!customerData) throw new BadRequestException('Unable to find the customer data')
    // const checkPwd = await isValidPassword(password)
    // if (!checkPwd) {
    //   throw new BadRequestException('Invalid username or password')
    // }

    try {
      const pwd = await encodePassword(password)

      await this.customerRepository.update(customerData.id, {
        password: pwd,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update customer data')
    }
    return { success: true, message: 'Password of customer has been updated' }
  }

  async updateCustomerEmail(userId: string, email: string): Promise<CustomerEmailUpdateResponse> {
    const emailExists = await this.isEmailExist(email)
    if (emailExists) throw new BadRequestException('Email already exists')
    try {
      const customerData: Partial<Customer> = await this.getCustomerById(userId)
      if (customerData.id) {
        await this.customerRepository.update(customerData.id, {
          email,
          updatedDate: new Date()
        })
      }

      const updatedCustomerData: Partial<Customer> = await this.getCustomerById(userId)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedCustomerData
      if (updatedCustomerData.id && updatedCustomerData.email) {
        const payload: JwtDto = {
          email: updatedCustomerData.email,
          sub: updatedCustomerData.id,
          type: JWT_STRATEGY_NAME.ADMIN
        }

        return {
          access_token: await this.getJwtToken(payload),
          user: rest
        }
      } else {
        throw new BadRequestException("Couldn't update email")
      }
    } catch (err) {
      throw new BadRequestException("Couldn't update email")
    }
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

  async updateOrganizerData(
    organizerInput: UpdateOrganizerInput,
    customerId: string
  ): Promise<Partial<Organizer>> {
    await this.getCustomerById(customerId)
    const organizerData = await this.getOrganizerById(organizerInput.idOrganizerUser, customerId)
    if (!organizerData)
      throw new BadRequestException('Unable to find the organizer. Please enter a valid organizer')
    try {
      await this.organizerRepository.update(organizerData.idOrganizerUser, {
        ...organizerInput,
        updatedBy: customerId,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    const updatedOrganizerData = await this.getOrganizerById(
      organizerInput.idOrganizerUser,
      customerId
    )

    return updatedOrganizerData
  }

  async getCustomerUploadUrl(): Promise<S3SignedUrlResponse> {
    const key = `${uuid()}-user-profile`
    const bucketName = this.configService.get('USER_UPLOADS_BUCKET')
    // const urlPrefix = this.configService.get('S3_MEDIA_PREFIX')
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
}
