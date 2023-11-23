import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'

import { Admin } from './entities/admin.entity'
import { AdminLoginResponse } from './dto/args/admin-login-response'
import { comparePassword, encodePassword, isValidPassword } from 'src/common/utils'
import { JwtDto } from 'src/common'
import { JWT_STRATEGY_NAME } from 'src/common/types'
import { LoginAdminInput } from './dto/inputs/login-admin.input'
import { CreateAdminUserInput } from './dto/inputs/create-admin-user.input'
import { SuccessResponse } from 'src/common/dto/success-response'
import { InjectRepository } from '@nestjs/typeorm'

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
    const isValidPwd = this.validatePassword(password, user?.password)
    if (isValidPwd) return user
    throw new BadRequestException('Invalid email or password')
  }

  async validatePassword(pwd: string, dbPwd: string): Promise<boolean> {
    // await this.isValidPwd(pwd)
    const isValidPwd = pwd && (await comparePassword(pwd, dbPwd))
    if (!isValidPwd) throw new BadRequestException('Invalid email or password')
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
}
