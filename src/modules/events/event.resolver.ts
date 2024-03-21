import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload, SuccessResponse } from '@app/common'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'

import { Event } from './entities'
import {
  CreateBasicEventInput,
  EventDetailsInput,
  ListEventsInputs,
  ListOrganizerEventsInputs,
  PublishOrUnPublishEventInput,
  UpdateBasicEventInput
} from './dto/inputs'
import { EventService } from './event.service'
import { ListEventsResponse } from './dto/args'

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  // Queries

  @Query(() => Event, { description: 'Get the Event' })
  @Allow()
  async getEventById(
    @Args('input') eventId: string,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Event> {
    return await this.eventService.getEventById(eventId, user.userId)
  }

  @Query(() => [S3SignedUrlResponse], {
    description: 'This will return signed Urls for Events'
  })
  @Allow()
  async getEventUploadUrls(
    @Args({ name: 'count', type: () => Number }) count: number
  ): Promise<S3SignedUrlResponse[]> {
    return this.eventService.getEventUploadUrls(count)
  }

  @Query(() => ListEventsResponse, {
    description: 'The List of Events with Pagination and filters'
  })
  @Allow()
  async getEvents(@Args('input') listEventsInputs: ListEventsInputs): Promise<ListEventsResponse> {
    const [events, count, limit, offset] =
      await this.eventService.getEventsWithPagination(listEventsInputs)
    return { results: events, totalRows: count, limit, offset }
  }

  @Query(() => ListEventsResponse, {
    description: 'The List of Events in Organizer side with Pagination and filters'
  })
  @Allow()
  async getEventsOrganizer(
    @Args('input') listOrganizerEventsInputs: ListOrganizerEventsInputs
  ): Promise<ListEventsResponse> {
    const [events, count, limit, offset] =
      await this.eventService.getEventsWithPaginationOrganizer(listOrganizerEventsInputs)
    return { results: events, totalRows: count, limit, offset }
  }

  // Mutations

  @Mutation(() => Event, {
    description: 'This will create new Events'
  })
  @Allow()
  async createBasicEvent(
    @Args('input') createBasicEventInput: CreateBasicEventInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Event> {
    return await this.eventService.createBasicEvent(createBasicEventInput, user.userId)
  }

  @Mutation(() => Event, {
    description: 'This will update basic Event'
  })
  @Allow()
  async updateBasicEvent(
    @Args('input') updateBasicEventInput: UpdateBasicEventInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Event> {
    return await this.eventService.updateBasicEvent(updateBasicEventInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will create or update new Event Details'
  })
  @Allow()
  async createOrUpdateEventDetails(
    @Args('input') eventDetailsInput: EventDetailsInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.eventService.createOrUpdateEventDetails(eventDetailsInput, user.userId)
  }

  @Mutation(() => Event, {
    description: 'This will Publish Event'
  })
  @Allow()
  async publishOrUnPublishEvent(
    @Args('input') publishOrUnPublishEventInput: PublishOrUnPublishEventInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Event> {
    return await this.eventService.publishOrUnPublishEvent(
      publishOrUnPublishEventInput,
      user.userId
    )
  }
}
