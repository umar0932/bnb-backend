import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload } from '@app/common'

import {
  CreateEventTicketInput,
  ListCustomerEventTicketsInputs,
  ListEventTicketsInputs,
  UpdateEventTicketInput
} from './dto/inputs'
import { ListCustomerEventTicketsResponse, ListEventTicketsResponse } from './dto/args'
import { Tickets } from './entities'
import { TicketService } from './ticket.service'

@Resolver(() => Tickets)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  // Queries

  @Query(() => ListEventTicketsResponse, {
    description: 'The List of Event Tickets with Pagination and filters'
  })
  @Allow()
  async getEventsTickets(
    @Args('input') listEventTicketsInputs: ListEventTicketsInputs
  ): Promise<ListEventTicketsResponse> {
    const [eventTickets, count, limit, offset] =
      await this.ticketService.getEventTicketsWithPagination(listEventTicketsInputs)
    return { results: eventTickets, totalRows: count, limit, offset }
  }

  @Query(() => ListCustomerEventTicketsResponse, {
    description: 'The List of Event Tickets with Pagination and filters'
  })
  @Allow()
  async getCustomerEventTickets(
    @Args('input') listCustomerEventTicketsInputs: ListCustomerEventTicketsInputs
  ): Promise<ListCustomerEventTicketsResponse> {
    const [eventTickets, count, limit, offset] = await this.ticketService.getCustomerEventTickets(
      listCustomerEventTicketsInputs
    )
    return { results: eventTickets, totalRows: count, limit, offset }
  }

  // Mutations

  @Mutation(() => Tickets, {
    description: 'This will create new Ticket for the Event'
  })
  @Allow()
  async createEventTickets(
    @Args('input') createEventTicketsInput: CreateEventTicketInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Tickets> {
    return await this.ticketService.createEventTicket(createEventTicketsInput, user.userId)
  }

  @Mutation(() => Tickets, {
    description: 'This will update ticket for the Event'
  })
  @Allow()
  async updateEventTicket(
    @Args('input') updateEventTicketsInput: UpdateEventTicketInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Tickets> {
    return await this.ticketService.updateEventTicket(updateEventTicketsInput, user.userId)
  }
}
