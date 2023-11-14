import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { CreateUserInput } from '@app/users/dto/create-user.input'
import { LoginUserInput } from './dto/inputs/login-user.input'
import { SignResponse } from './dto/args/sign-response'
import { User } from '@app/users/entities/user.entity'
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

  async login(loginUserInput: LoginUserInput, contextUser: User): Promise<SignResponse> {
    const accessToken = await this.createToken(contextUser.id, loginUserInput?.email)
    return {
      access_token: accessToken,
      user: contextUser
    }
  }

  async signup(signupUserInput: CreateUserInput): Promise<SignResponse> {
    const user = await this.userService.findOne(signupUserInput.email)

    if (user) throw new BadRequestException('Username already exists')

    const password = await bcrypt.hash(signupUserInput.password, 10)

    const currentUser: User = await this.userService.create({
      ...signupUserInput,
      password
    })

    const accessToken = await this.createToken(currentUser.id, currentUser.email)
    return {
      access_token: accessToken,
      user: currentUser
    }
  }

  async createToken(userId: string, email: string) {
    const accessToken = await this.jwtService.sign({
      userId,
      email
    })
    return accessToken
  }
}
