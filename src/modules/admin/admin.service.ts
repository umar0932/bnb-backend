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

import {
  ForgotPasswordInput,
  JWT_STRATEGY_NAME,
  JwtDto,
  ResetForgotPasswordInput,
  SuccessResponse,
  comparePassword,
  encodePassword,
  generateOTP,
  isValidPassword
} from '@app/common'
import { MailService } from '@app/mail'

import { Admin } from './entities'
import { AdminEmailUpdateResponse, AdminLoginResponse } from './dto/args'
import { CreateAdminUserInput, LoginAdminInput, UpdateAdminUserInput } from './dto/inputs'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  // Private Methods

  // Public Methods

  async adminOnlyAccess(userType: string): Promise<void> {
    if (userType !== JWT_STRATEGY_NAME.ADMIN) throw new ForbiddenException('Only Admins Access')
  }

  async forgotPassword(email: string): Promise<Admin> {
    const admin = await this.getAdminByEmail(email)

    return admin
  }

  async getAdminById(id: string): Promise<Admin> {
    const findAdminById = await this.adminRepository.findOne({ where: { id } })
    if (!findAdminById) throw new NotFoundException('Invalid Admin user')

    return findAdminById
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    if (!email) throw new BadRequestException('Admin Email is invalid')
    const findAdminByEmail = await this.adminRepository.findOne({
      where: { email, isActive: true }
    })
    if (!findAdminByEmail)
      throw new NotFoundException('Admin with the provided email does not exist')

    return findAdminByEmail
  }

  getJwtToken = async ({ sub, email, firstName, lastName, profileImage, type }: JwtDto) => {
    const payload: JwtDto = { sub, email, firstName, lastName, profileImage, type }
    return await this.jwtService.sign(payload)
  }

  async isValidPwd(pwd: string): Promise<boolean> {
    const checkPwd = isValidPassword(pwd)

    if (!checkPwd) throw new BadRequestException('Invalid email or password')

    return true
  }

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const user = await this.adminRepository.findOne({ where: { email } })
    if (!user) throw new BadRequestException('Invalid email or password')
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

  async isEmailExist(email: string): Promise<SuccessResponse> {
    const emailExists = await this.adminRepository.count({ where: { email } })
    if (emailExists > 0) return { success: true, message: 'Email is valid' }

    return { success: false, message: 'Email is invalid' }
  }

  // Resolver Mutation Methods

  async createAdmin(data: CreateAdminUserInput, id: string): Promise<SuccessResponse> {
    const { email } = data

    console.log(id)

    // await this.getAdminById(id)

    const adminUser = await this.adminRepository.findOne({ where: { email } })
    if (adminUser) throw new BadRequestException('Email already exists')

    const password = await encodePassword(data.password)

    await this.adminRepository.save({
      ...data,
      isActive: true,
      password
    })

    return {
      success: true,
      message: 'Created a new admin'
    }
  }

  async loginAdmin(loginAdminInput: LoginAdminInput, admin: Admin): Promise<AdminLoginResponse> {
    const payload = {
      sub: admin?.id,
      email: loginAdminInput?.email,
      firstName: admin?.firstName,
      lastName: admin?.lastName,
      type: JWT_STRATEGY_NAME.ADMIN
    }
    return {
      accessToken: await this.getJwtToken(payload),
      user: admin
    }
  }

  async saveMediaUrl(fileName: string): Promise<string> {
    const bucketName = this.configService.get('ADMIN_UPLOADS_BUCKET')

    const url = `${bucketName}/${fileName}`
    return url
  }

  async updateAdminData(
    updateAdminUserInput: UpdateAdminUserInput,
    userId: string
  ): Promise<Partial<Admin>> {
    const { profileImage } = updateAdminUserInput
    const adminData = await this.getAdminById(userId)
    let signedUrl

    if (profileImage) {
      signedUrl = await this.saveMediaUrl(profileImage)
    }
    try {
      await this.adminRepository.update(adminData.id, {
        ...updateAdminUserInput,
        profileImage: signedUrl,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    const updatedAdminData = await this.getAdminById(userId)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedAdminData

    return rest
  }

  async updateAdminEmail(userId: string, email: string): Promise<AdminEmailUpdateResponse> {
    const emailExists = await this.isEmailExist(email)
    if (emailExists) throw new BadRequestException('Email already exists')
    try {
      const adminData: Partial<Admin> = await this.getAdminById(userId)
      if (adminData.id) {
        await this.adminRepository.update(adminData.id, {
          email,
          updatedDate: new Date()
        })
      }

      const updatedAdminData: Partial<Admin> = await this.getAdminById(userId)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedAdminData
      if (
        updatedAdminData.id &&
        updatedAdminData.email &&
        updatedAdminData.firstName &&
        updatedAdminData.lastName
      ) {
        const payload: JwtDto = {
          sub: updatedAdminData.id,
          email: updatedAdminData.email,
          firstName: updatedAdminData.firstName,
          lastName: updatedAdminData.lastName,
          profileImage: updatedAdminData.profileImage,
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

  async updatePassword(password: string, adminId: string): Promise<SuccessResponse> {
    const adminData = await this.getAdminById(adminId)
    // const checkPwd = await isValidPassword(password)
    // if (!checkPwd) {
    //   throw new BadRequestException('Invalid username or password')
    // }

    try {
      const pwd = await encodePassword(password)

      await this.adminRepository.update(adminData.id, {
        password: pwd,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update admin data')
    }
    return { success: true, message: 'Password of admin has been updated' }
  }

  async sendEmailForgotPassword(
    forgotPasswordInput: ForgotPasswordInput
  ): Promise<SuccessResponse> {
    const { email } = forgotPasswordInput || {}

    const admin = await this.forgotPassword(email)
    const code = generateOTP()

    try {
      const encodedCode = await encodePassword(code)
      await this.mailService.sendForgotPasswordEmail(admin.email, admin.firstName, code)
      await this.adminRepository.update(admin.id, {
        resetPaswordOTP: encodedCode,
        updatedBy: admin.id,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to send forgot Email')
    }
    return { success: true, message: 'Forgot Email send' }
  }

  async resetPassword(
    resetForgotPasswordInput: ResetForgotPasswordInput
  ): Promise<SuccessResponse> {
    const { email, code, password } = resetForgotPasswordInput || {}
    const admin = await this.forgotPassword(email)

    if (admin?.resetPaswordOTP) {
      const isValidCode = await this.validatePassword(code, admin.resetPaswordOTP)
      if (!isValidCode) throw new BadRequestException('OTP Code is Invalid')
    }

    try {
      const pwd = await encodePassword(password)
      await this.adminRepository.update(admin.id, {
        password: pwd,
        updatedBy: admin.id,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update admin password')
    }
    return { success: true, message: 'Password of admin has been updated' }
  }
}
