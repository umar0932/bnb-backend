import { Field, ObjectType } from '@nestjs/graphql'

import { Admin } from '@app/admin/entities/admin.entity'

@ObjectType()
export class AdminLoginResponse {
  @Field()
  access_token: string

  @Field(() => Admin)
  user: Partial<Admin>
}
