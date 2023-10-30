import { InputType, Field } from '@nestjs/graphql'

import Role from '@app/enums/roles.enum'

@InputType()
export class CreateUserInput {
  @Field()
  email: string

  @Field()
  password: string

  @Field({ nullable: true })
  role: Role
}
