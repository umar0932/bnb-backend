import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class JWTGuard extends AuthGuard(['jwtCustomer', 'jwtAdmin']) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    console.log('ctx----->>>>>>>>>>', ctx)
    return ctx.getContext().req
  }
}
