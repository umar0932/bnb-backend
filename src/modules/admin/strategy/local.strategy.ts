// import { Strategy } from 'passport-local'
// import { PassportStrategy } from '@nestjs/passport'
// import { Injectable, UnauthorizedException } from '@nestjs/common'

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy, 'adminUser') {
//   constructor(private adminService: AdminService) {
//     super({
//       usernameField: 'email',
//       passwordField: 'password'
//     })
//   }

//   async validate(username: string, password: string): Promise<any> {
//     const user = await this.adminService.validateAdmin(username, password)
//     if (!user) {
//       throw new UnauthorizedException()
//     }
//     return user
//   }
// }
