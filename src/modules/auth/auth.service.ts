import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { CreateUserInput } from '@app/users/dto/create-user.input'
import { LoginUserInput } from './dto/inputs/login-user.input'
import { UserService } from '@app/users/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email)
    const valid = user && (await bcrypt.compare(password, user?.password))

    if (user && valid) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.userService.findOne(loginUserInput.email)
    const { password, ...result } = user

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id
        // role: user.role
      }),
      user: result
    }
  }

  async signup(signupUserInput: CreateUserInput) {
    const user = await this.userService.findOne(signupUserInput.email)

    if (user) {
      throw new Error('User already exists')
    }

    const password = await bcrypt.hash(signupUserInput.password, 10)

    return this.userService.create({
      ...signupUserInput,
      password
    })
  }
}
