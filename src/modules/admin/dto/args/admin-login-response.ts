import { Field, ObjectType } from '@nestjs/graphql'

import { Admin } from '@app/admin/entities/admin.entity'

@ObjectType()
export class AdminLoginResponse {
  @Field()
  accessToken: string

  @Field(() => Admin)
  user: Partial<Admin>
}
