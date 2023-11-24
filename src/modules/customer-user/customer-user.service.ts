import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'

import { comparePassword, encodePassword, isValidPassword } from '@app/common/utils'
import { JwtDto } from '@app/common'
import { JWT_STRATEGY_NAME } from '@app/common/types'

import { Admin } from '@app/admin/entities/admin.entity'
import { Customer } from './entities/customer.entity'
import { CreateCustomerInput } from './dto/inputs/create-customer.input'
import { CustomerLoginResponse } from './dto/args/customer-login-response'
import { LoginCustomerInput } from './dto/inputs/login-customer.input'

@Injectable()
export class CustomerUserService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService
  ) {}

  async validateCustomer(email: string, password: string): Promise<any> {
    const user = await this.customerRepository.findOne({ where: { email } })
    if (!user) throw new BadRequestException('Invalid email or password-1')
    const isValidPwd = this.validatePassword(password, user?.password)
    if (isValidPwd) return user
    throw new BadRequestException('Invalid email or password-4')
  }

  async validatePassword(pwd: string, dbPwd: string): Promise<boolean> {
    // await this.isValidPwd(pwd)
    const isValidPwd = pwd && (await comparePassword(pwd, dbPwd))
    if (!isValidPwd) throw new BadRequestException('Invalid email or password-2')
    return true
  }

  async isValidPwd(pwd: string): Promise<boolean> {
    const checkPwd = isValidPassword(pwd)

    if (!checkPwd) throw new BadRequestException('Invalid email or password-3')
    return true
  }

  async login(
    loginCustomerInput: LoginCustomerInput,
    contextUser: Customer
  ): Promise<CustomerLoginResponse> {
    const payload = {
      email: loginCustomerInput?.email,
      sub: contextUser?.id,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }
    return {
      access_token: await this.getJwtToken(payload),
      user: contextUser
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
    
    if (!isAdmin) throw new UnauthorizedException('Only admin can access this data.')

    return await this.customerRepository.find()
  }

  // create(createUserInput: CreateCustomerInput) {
  //   const user = this.customerRepository.create(createUserInput)
  //   return this.customerRepository.save(user)
  // }
}
