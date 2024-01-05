import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload, SuccessResponse } from '@app/common'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'

import { Event } from './entities'
import {
  CreateBasicEventInput,
  CreateEventTicketInput,
  EventDetailsInput,
  UpdateBasicEventInput,
  UpdateEventTicketInput
} from './dto/inputs'
import { EventService } from './event.service'

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => SuccessResponse, {
    description: 'This will crete new Events'
  })
  @Allow()
  async createBasicEvent(
    @Args('input') createBasicEventInput: CreateBasicEventInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.createBasicEvent(createBasicEventInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will update ticket for the Event'
  })
  @Allow()
  async updateBasicEvent(
    @Args('input') updateBasicEventInput: UpdateBasicEventInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.updateBasicEvent(updateBasicEventInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will crete new Events'
  })
  @Allow()
  async createOrUpdateEventDetails(
    @Args('input') eventDetailsInput: EventDetailsInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.createOrUpdateEventDetails(eventDetailsInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will create new Ticket for the Event'
  })
  @Allow()
  async createEventTickets(
    @Args('input') createEventTicketsInput: CreateEventTicketInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.createEventTicket(createEventTicketsInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will update ticket for the Event'
  })
  @Allow()
  async updateEventTicket(
    @Args('input') updateEventTicketsInput: UpdateEventTicketInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.updateEventTicket(updateEventTicketsInput, user.userId)
  }

  @Query(() => [S3SignedUrlResponse], {
    description: 'This will return signed Urls for Events'
  })
  @Allow()
  async getEventUploadUrls(@Args({ name: 'count', type: () => Number }) count: number) {
    return this.eventService.getEventUploadUrls(count)
  }
}
