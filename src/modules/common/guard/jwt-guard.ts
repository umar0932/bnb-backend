import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class JWTGuard extends AuthGuard(['jwtCustomer', 'jwtAdmin']) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
  handleRequest(...args: Parameters<InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']>) {
    return super.handleRequest(...args);
  }
}
