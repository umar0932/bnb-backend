import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Brackets, Repository } from 'typeorm'

import { CustomerUserService } from '@app/customer-user'
import { Event } from '@app/events/entities'
import { EventService } from '@app/events'
import { JWT_STRATEGY_NAME, JwtUserPayload } from '@app/common'
import { TicketType } from '@app/order/types'

import {
  CreateEventTicketInput,
  ListCustomerTicketsInputs,
  ListEventTicketsInputs,
  UpdateEventTicketInput
} from './dto/inputs'
import { CustomerTickets, Tickets } from './entities'

@Injectable()
export class TicketService {
  constructor(
    @Inject(forwardRef(() => CustomerUserService))
    private customerService: CustomerUserService,
    @InjectRepository(CustomerTickets)
    private customerTicketsRepository: Repository<CustomerTickets>,
    private eventService: EventService,
    @InjectRepository(Tickets)
    private eventTicketsRepository: Repository<Tickets>
  ) {}

  // Private Methods

  // Public Methods

  async getEventTicketsByName(title: string, customerId: string): Promise<boolean> {
    const findEventTickets = await this.eventTicketsRepository.count({
      where: { title, createdBy: customerId }
    })
    if (findEventTickets > 0) return true
    return false
  }

  async getEventTicketsById(id: string, userId: string): Promise<Tickets> {
    const findEventTicketsById = await this.eventTicketsRepository.findOne({
      where: { id, createdBy: userId }
    })
    if (!findEventTicketsById)
      throw new BadRequestException('Event Tickets with the provided ID does not exist')

    return findEventTicketsById
  }

  async getEventTickets(id: string, eventId: string): Promise<Tickets> {
    const findEventTickets = await this.eventTicketsRepository.findOne({
      where: { id, event: { id: eventId } }
    })
    if (!findEventTickets) throw new NotFoundException('Event Ticket with ID not found.')

    return findEventTickets
  }

  async getCustomerTicketsById(id: string): Promise<CustomerTickets> {
    const findCustomerTickets = await this.customerTicketsRepository.findOne({
      where: { id }
    })
    if (!findCustomerTickets) throw new NotFoundException('Customer Ticket with ID not found.')

    return findCustomerTickets
  }

  async setTicketsSoldByEvent(event: Event, userId: string, tickets: TicketType[]): Promise<void> {
    let totalTicketsSold = 0
    let ticketsGrossTotal = 0

    for (const ticket of tickets) {
      const dbTicket = await this.getEventTickets(ticket.id, event.id)

      if (ticket.quantity > dbTicket.maxQuantity)
        throw new BadRequestException(
          'Quantity to buy tickets cannot be more then the maximum quantity.'
        )

      if (ticket.quantity > dbTicket.availableQuantity)
        throw new BadRequestException('Not enough available tickets for ticket with ID.')

      const grossTotal = ticket.quantity * ticket.price
      totalTicketsSold += ticket.quantity
      ticketsGrossTotal += grossTotal

      await this.eventTicketsRepository.update(
        { id: ticket.id },
        {
          availableQuantity: dbTicket.availableQuantity - ticket.quantity,
          ticketsSold: dbTicket.ticketsSold
            ? Number(dbTicket.ticketsSold || 0) + ticket.quantity
            : ticket.quantity,
          grossTotal: dbTicket.grossTotal
            ? Number(dbTicket.grossTotal || 0) + grossTotal
            : dbTicket.grossTotal
        }
      )
      for (let i = 0; i < ticket.quantity; i++) {
        await this.createCustomerEventTicket(event, userId, dbTicket)
      }
    }
    await this.eventService.updateEventTotalTickets(event, totalTicketsSold, ticketsGrossTotal)
  }

  async createCustomerEventTicket(event: Event, userId: string, ticket: Tickets): Promise<void> {
    await this.customerTicketsRepository.save({
      event,
      ticket,
      customer: { id: userId },
      price: ticket.price,
      createdBy: userId
    })
  }

  // Resolver Query Methods

  async getEventTicketsWithPagination(
    listEventTicketsInputs: ListEventTicketsInputs
  ): Promise<[Tickets[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listEventTicketsInputs
    const { title, search } = filter || {}

    try {
      const queryBuilder = this.eventTicketsRepository.createQueryBuilder('eventTickets')

      title && queryBuilder.andWhere('eventTickets.title = :title', { title })

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(eventTickets.title) LIKE LOWER(:search)', { search: `${search}` })
          })
        )
      }

      const [eventTickets, total] = await queryBuilder
        .leftJoinAndSelect('eventTickets.event', 'event')
        .leftJoinAndSelect('eventTickets.customer', 'customer')
        .take(limit)
        .skip(offset)
        .getManyAndCount()

      return [eventTickets, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Event Tickets')
    }
  }

  async getCustomerTickets(
    listCustomerTicketsInputs: ListCustomerTicketsInputs,
    user: JwtUserPayload
  ): Promise<[CustomerTickets[], number, number, number]> {
    const { limit = 10, offset = 0, eventId, customerId } = listCustomerTicketsInputs
    const { userId, type } = user || {}

    try {
      const queryBuilder = this.customerTicketsRepository.createQueryBuilder('customerTickets')

      queryBuilder
        .leftJoinAndSelect('customerTickets.event', 'event')
        .leftJoinAndSelect('customerTickets.customer', 'customer')
        .leftJoinAndSelect('customerTickets.ticket', 'ticket')
        .take(limit)
        .skip(offset)

      if (type === JWT_STRATEGY_NAME.ADMIN) {
        if (eventId) queryBuilder.andWhere('event.id = :eventId', { eventId })
        else if (customerId) queryBuilder.where('customer.id = :customerId', { customerId })
      } else queryBuilder.where('customer.id = :userId', { userId })

      const [customerTickets, total] = await queryBuilder.getManyAndCount()

      return [customerTickets, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Customer Tickets')
    }
  }

  // Resolver Mutation Methods

  async createEventTicket(
    createEventTicketsInput: CreateEventTicketInput,
    userId: string
  ): Promise<Tickets> {
    const { eventId, ...rest } = createEventTicketsInput
    await this.eventService.getEventById(eventId, userId)
    const ticketData = await this.getEventTicketsByName(createEventTicketsInput.title, userId)
    if (ticketData)
      throw new BadRequestException('This Ticket name already exist. Enter a valid name')

    if (createEventTicketsInput.maxQuantity > createEventTicketsInput.availableQuantity)
      throw new BadRequestException(
        'Maximum quantity cannot be greater than the available quantity'
      )

    try {
      const ticket = await this.eventTicketsRepository.save({
        ...rest,
        event: { id: eventId },
        createdBy: userId
      })

      return ticket
    } catch (error) {
      throw new BadRequestException('Failed to create Tickets')
    }
  }

  async updateEventTicket(
    updateEventTicketsInput: UpdateEventTicketInput,
    userId: string
  ): Promise<Tickets> {
    const { eventId, id, ...rest } = updateEventTicketsInput
    await this.eventService.getEventById(eventId, userId)
    const ticketData = await this.getEventTicketsById(id, userId)

    if (updateEventTicketsInput.availableQuantity && updateEventTicketsInput.maxQuantity) {
      if (updateEventTicketsInput.maxQuantity > updateEventTicketsInput.availableQuantity)
        throw new BadRequestException(
          'Maximum quantity cannot be greater than the available quantity'
        )
    }

    try {
      await this.eventTicketsRepository.update(ticketData.id, {
        ...rest,
        event: { id: eventId },
        updatedBy: userId,
        updatedDate: new Date()
      })

      return await this.getEventTicketsById(id, userId)
    } catch (error) {
      throw new BadRequestException('Failed to update Tickets')
    }
  }

  async scanTicket(ticketId: string): Promise<CustomerTickets> {
    const customerEventTicketData = await this.getCustomerTicketsById(ticketId)

    if (customerEventTicketData.isCheckedIn)
      throw new BadRequestException('Customer is already checked in')

    try {
      await this.customerTicketsRepository.update(customerEventTicketData.id, {
        isCheckedIn: true,
        checkInTime: new Date(),
        updatedDate: new Date()
      })

      return await this.getCustomerTicketsById(ticketId)
    } catch (error) {
      throw new BadRequestException('Failed to update Customer Tickets')
    }
  }
}
