import { Resolver, Mutation, Args } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload, SuccessResponse } from '@app/common'

import { Event } from './entities'
import { CreateEventInput } from './dto/inputs'
import { EventService } from './event.service'

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => SuccessResponse, {
    description: 'This will crete new Events'
  })
  @Allow()
  async createEvent(
    @Args('input') createEventData: CreateEventInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.createEvent(createEventData, user.userId)
  }
}
