import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'

import {
  JWT_STRATEGY_NAME,
  JwtDto,
  SuccessResponse,
  comparePassword,
  encodePassword,
  isValidPassword
} from '@app/common'

import { Admin } from './entities'
import { AdminEmailUpdateResponse, AdminLoginResponse } from './dto/args'
import { CreateAdminUserInput, LoginAdminInput, UpdateAdminUserInput } from './dto/inputs'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  getJwtToken = async ({ sub, email, type }: JwtDto) => {
    const payload: JwtDto = { email, sub, type }
    return await this.jwtService.sign(payload)
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

  async isValidPwd(pwd: string): Promise<boolean> {
    const checkPwd = isValidPassword(pwd)

    if (!checkPwd) throw new BadRequestException('Invalid email or password')

    return true
  }

  async login(loginAdminInput: LoginAdminInput, contextUser: Admin): Promise<AdminLoginResponse> {
    const payload = {
      email: loginAdminInput?.email,
      sub: contextUser?.idAdminUser,
      type: JWT_STRATEGY_NAME.ADMIN
    }
    return {
      accessToken: await this.getJwtToken(payload),
      user: contextUser
    }
  }

  async getAdminById(idAdminUser: string): Promise<Admin> {
    const findAdminById = await this.adminRepository.findOne({ where: { idAdminUser } })
    if (!findAdminById) throw new ForbiddenException('Invalid Admin user')

    return findAdminById
  }

  async isEmailExist(email: string): Promise<SuccessResponse> {
    const emailExists = await this.adminRepository.count({ where: { email } })
    if (emailExists > 0) return { success: true, message: 'Email is valid' }

    return { success: false, message: 'Email is invalid' }
  }

  async create(data: CreateAdminUserInput, idAdminUser: string): Promise<SuccessResponse> {
    const { email } = data

    console.log(idAdminUser)

    // await this.getAdminById(idAdminUser)

    const adminUser = await this.adminRepository.findOne({ where: { email } })
    if (adminUser) throw new BadRequestException('Email already exists')

    const password = await encodePassword(data.password)

    await this.adminRepository.save({
      ...data,
      password
    })

    return {
      success: true,
      message: 'Created a new admin'
    }
  }

  async updateAdminData(
    updateAdminUserInput: UpdateAdminUserInput,
    userId: string
  ): Promise<Partial<Admin>> {
    const { mediaUrl } = updateAdminUserInput
    const adminData = await this.getAdminById(userId)
    let signedUrl

    if (mediaUrl) {
      signedUrl = await this.saveMediaUrl(mediaUrl)
    }
    try {
      await this.adminRepository.update(adminData.idAdminUser, {
        ...updateAdminUserInput,
        mediaUrl: signedUrl,
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

  async updatePassword(password: string, adminId: string): Promise<SuccessResponse> {
    const adminData = await this.getAdminById(adminId)
    // const checkPwd = await isValidPassword(password)
    // if (!checkPwd) {
    //   throw new BadRequestException('Invalid username or password')
    // }

    try {
      const pwd = await encodePassword(password)

      await this.adminRepository.update(adminData.idAdminUser, {
        password: pwd,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update admin data')
    }
    return { success: true, message: 'Password of admin has been updated' }
  }

  async updateAdminEmail(userId: string, email: string): Promise<AdminEmailUpdateResponse> {
    const emailExists = await this.isEmailExist(email)
    if (emailExists) throw new BadRequestException('Email already exists')
    try {
      const adminData: Partial<Admin> = await this.getAdminById(userId)
      if (adminData.idAdminUser) {
        await this.adminRepository.update(adminData.idAdminUser, {
          email,
          updatedDate: new Date()
        })
      }

      const updatedAdminData: Partial<Admin> = await this.getAdminById(userId)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedAdminData
      if (updatedAdminData.idAdminUser && updatedAdminData.email) {
        const payload: JwtDto = {
          email: updatedAdminData.email,
          sub: updatedAdminData.idAdminUser,
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

  async saveMediaUrl(fileName: string): Promise<string> {
    const bucketName = this.configService.get('ADMIN_UPLOADS_BUCKET')
    const urlPrefix = this.configService.get('S3_MEDIA_PREFIX')
    const url = `${urlPrefix}${bucketName}/${fileName}`
    return url
  }
}
