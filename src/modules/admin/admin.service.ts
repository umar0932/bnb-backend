import { BadRequestException, Injectable } from '@nestjs/common'
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
import { CreateAdminUserInput, LoginAdminInput } from './dto/inputs'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
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
      access_token: await this.getJwtToken(payload),
      user: contextUser
    }
  }

  async getAdminById(idAdminUser: string): Promise<Admin> {
    try {
      const findAdmin = this.adminRepository.findOne({ where: { idAdminUser } })
      if (!findAdmin)
        throw new BadRequestException('Unable to find the admin. Please verify the admin id')

      return findAdmin
    } catch (e) {
      throw new BadRequestException('Failed to fetch admin. Check the customerID')
    }
  }
  async isEmailExist(email: string): Promise<SuccessResponse> {
    const emailExists = await this.adminRepository.count({ where: { email } })
    if (emailExists > 0) return { success: true, message: 'Email is valid' }

    return { success: false, message: 'Email is invalid' }
  }

  async create(data: CreateAdminUserInput, contextUser: Admin): Promise<SuccessResponse> {
    const { email } = data

    const user = await this.adminRepository.findOne({ where: { email } })
    if (user) throw new BadRequestException('Email already exists')

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

  async updatePassword(password: string, adminId: string): Promise<SuccessResponse> {
    const adminData = await this.getAdminById(adminId)
    if (!adminData) throw new BadRequestException('Unable to find the admin data')
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

  async updateAdminEmail(user: any, email: string): Promise<AdminEmailUpdateResponse> {
    const emailExists = await this.isEmailExist(email)
    if (emailExists) throw new BadRequestException('Email already exists')
    try {
      const adminData: Partial<Admin> = await this.getAdminById(user.userId)
      if (adminData) {
        await this.adminRepository.update(adminData.idAdminUser, {
          email,
          updatedDate: new Date()
        })
      }

      const updatedAdminData: Partial<Admin> = await this.getAdminById(user.id)

      const { password, ...rest } = updatedAdminData
      const payload = {
        email: updatedAdminData?.email,
        sub: updatedAdminData?.idAdminUser,
        type: JWT_STRATEGY_NAME.ADMIN
      }
      return {
        access_token: await this.getJwtToken(payload),
        user: rest
      }
    } catch (err) {
      throw new BadRequestException("Couldn't update email")
    }
  }
}
