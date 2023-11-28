import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'

import { Repository } from 'typeorm'

import { comparePassword, encodePassword, isValidPassword } from '@app/common/utils'
import { JwtDto } from '@app/common'
import { JWT_STRATEGY_NAME } from '@app/common/types'

import { Admin } from '@app/admin/entities/admin.entity'
import { CreateCustomerInput } from './dto/inputs/create-customer.input'
import { Customer } from './entities/customer.entity'
import { CustomerEmailUpdateResponse } from './dto/args/customer-email-update-response'
import { CustomerLoginResponse } from './dto/args/customer-login-response'
import { LoginCustomerInput } from './dto/inputs/login-customer.input'
import { SuccessResponse } from '@app/common/dto/success-response'

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
    try {
      const findCustomer = this.customerRepository.findOne({ where: { id, isActive: true } })
      if (!findCustomer)
        throw new BadRequestException('Unable to find the customer. Please verify the customer id')

      return findCustomer
    } catch (e) {
      throw new BadRequestException('Failed to fetch customer. Check the customerID')
    }
  }

  async isEmailExist(email: string): Promise<SuccessResponse> {
    const emailExists = await this.customerRepository.count({ where: { email } })
    if (emailExists > 0) return { success: true, message: 'Email is valid' }

    return { success: false, message: 'Email is invalid' }
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

  async updateCustomerEmail(user: any, email: string): Promise<CustomerEmailUpdateResponse> {
    const emailExists = await this.isEmailExist(email)
    if (emailExists) throw new BadRequestException('Email already exists')
    try {
      const customerData: Partial<Customer> = await this.getCustomerById(user.userId)
      if (customerData) {
        await this.customerRepository.update(customerData.id, {
          email,
          updatedDate: new Date()
        })
      }

      const updatedCustomerData: Partial<Customer> = await this.getCustomerById(user.id)

      const { password, ...rest } = updatedCustomerData
      const payload = {
        email: updatedCustomerData?.email,
        sub: updatedCustomerData?.id,
        type: JWT_STRATEGY_NAME.CUSTOMER
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
