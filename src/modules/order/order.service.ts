import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'

import { Brackets, EntityManager, Repository } from 'typeorm'

import { CustomerUserService } from '@app/customer-user'
import { EventService } from '@app/events'
import { SuccessResponse } from '@app/common'

import { CreateOrderInput, ListOrdersInputs, ListOrganizerOrdersInputs } from './dto/inputs'
import { OrderEntity } from './entities'
import { OrderStatus } from './types'

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => CustomerUserService))
    private customerService: CustomerUserService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(forwardRef(() => EventService))
    private eventService: EventService,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>
  ) {}

  // Private Methods

  // Public Methods

  // Resolver Query Methods

  async getOrdersWithPagination(
    listOrdersInputs: ListOrdersInputs
  ): Promise<[OrderEntity[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listOrdersInputs
    const { search } = filter || {}

    try {
      const queryBuilder = this.orderRepository.createQueryBuilder('orders')

      console.log('searchOrder', search)

      // if (search) {
      //   queryBuilder.andWhere(
      //     new Brackets(qb => {
      //       qb.where('LOWER(orders.title) LIKE LOWER(:search)', { search: `${search}` })
      //     })
      //   )
      // }

      const [orders, total] = await queryBuilder
        .leftJoinAndSelect('orders.event', 'eventOrders')
        .leftJoinAndSelect('orders.customer', 'customerOrders')
        .take(limit)
        .skip(offset)
        .getManyAndCount()

      return [orders, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Events')
    }
  }

  async getOrganizerOrdersWithPagination(
    listOrganizerOrdersInputs: ListOrganizerOrdersInputs
  ): Promise<[OrderEntity[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listOrganizerOrdersInputs
    const { search, pastOneMonth, pastTwoMonths, pastThreeMonths } = filter || {}

    try {
      const queryBuilder = this.orderRepository.createQueryBuilder('orders')

      if (pastOneMonth) {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        queryBuilder.andWhere('event.startDate >= :oneMonthAgo', { oneMonthAgo })
      }
      if (pastTwoMonths) {
        const twoMonthsAgo = new Date()
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
        queryBuilder.andWhere('event.startDate >= :twoMonthsAgo', { twoMonthsAgo })
      }
      if (pastThreeMonths) {
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        queryBuilder.andWhere('event.startDate >= :threeMonthsAgo', { threeMonthsAgo })
      }

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(orders.event.title) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(orders.customer.firstName) LIKE LOWER(:search)', {
                search: `${search}`
              })
              .orWhere('LOWER(orders.customer.lastName) LIKE LOWER(:search)', {
                search: `${search}`
              })
          })
        )
      }

      const [orders, total] = await queryBuilder
        .leftJoinAndSelect('orders.event', 'eventOrders')
        .leftJoinAndSelect('orders.customer', 'customerOrders')
        .take(limit)
        .skip(offset)
        .getManyAndCount()

      return [orders, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Events')
    }
  }

  async getOrdersOfCustomer(userId: string): Promise<OrderEntity[]> {
    await this.customerService.getCustomerById(userId)

    return await this.orderRepository.find({ where: { createdBy: userId } })
  }

  // Resolver Mutations Methods

  async createOrder(
    orderInput: CreateOrderInput,
    userId: string,
    paymentIntentId: string
  ): Promise<SuccessResponse> {
    return this.entityManager.transaction(async transactionalManager => {
      const customer = await this.customerService.getCustomerById(userId)
      const { eventId } = orderInput

      const event = await this.eventService.findFromAllEvents(eventId)

      try {
        const order = await transactionalManager.save(OrderEntity, {
          ...orderInput,
          event: { id: eventId },
          customer: { id: customer.id },
          orderStatus: paymentIntentId ? OrderStatus.SUCCEEDED : OrderStatus.FAILED,
          paymentIntentId,
          stripeCustomerId: customer.stripeCustomerId,
          createdBy: userId
        })

        await this.eventService.setTicketsSoldByEvent(event, userId, order.tickets)

        return { success: true, message: 'Order Created' }
      } catch (error) {
        throw new BadRequestException(error.message ? error.message : 'Order does not created')
      }
    })
  }
}
