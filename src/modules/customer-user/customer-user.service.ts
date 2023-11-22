import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'

import { Customer } from './entities/customer.entity'
import { comparePassword, encodePassword, isValidPassword } from 'src/common/utils'
import { CreateCustomerInput } from './dto/inputs/create-customer.input'
import { CustomerLoginResponse } from './dto/args/customer-login-response'
import { JwtDto } from 'src/common'
import { JWT_STRATEGY_NAME } from 'src/common/types'
import { LoginCustomerInput } from './dto/inputs/login-customer.input'

@Injectable()
export class CustomerUserService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService
  ) {}

  async validateCustomer(email: string, password: string): Promise<any> {
    const user = await this.customerRepository.findOne({ where: { email } })
    if (!user) throw new BadRequestException('Invalid username or password')
    const isValidPwd = this.validatePassword(password, user?.password)
    if (isValidPwd) return user
    throw new BadRequestException('Invalid username or password')
  }

  async validatePassword(pwd: string, dbPwd: string): Promise<boolean> {
    // await this.isValidPwd(pwd)
    const isValidPwd = pwd && comparePassword(pwd, dbPwd)
    if (!isValidPwd) {
      throw new BadRequestException('Invalid username or password')
    }
    return true
  }

  async isValidPwd(pwd: string): Promise<boolean> {
    const checkPwd = isValidPassword(pwd)

    if (!checkPwd) {
      throw new BadRequestException('Invalid username or password')
    }
    return true
  }

  async login(
    loginCustomerInput: LoginCustomerInput,
    contextUser: Customer
  ): Promise<CustomerLoginResponse> {
    const payload = {
      username: loginCustomerInput?.email,
      sub: contextUser?.id,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }
    return {
      access_token: this.getJwtToken(payload),
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
      username: currentUser?.email,
      type: JWT_STRATEGY_NAME.CUSTOMER
    }

    return {
      access_token: this.getJwtToken(payload),
      user: currentUser
    }
  }

  getJwtToken = ({ sub, username, type }: JwtDto) => {
    const payload: JwtDto = { username, sub, type }
    return this.jwtService.sign(payload)
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find()
  }

  // create(createUserInput: CreateCustomerInput) {
  //   const user = this.customerRepository.create(createUserInput)
  //   return this.customerRepository.save(user)
  // }
}
