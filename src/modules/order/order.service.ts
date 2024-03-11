import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DeepPartial, Repository } from 'typeorm'

import { CustomerUserService } from '@app/customer-user'
import { EventService } from '@app/events'
import { SuccessResponse } from '@app/common'

import { CreateOrderInput } from './dto/inputs'
import { OrderEntity } from './entities'
import { OrderStatus } from './types'

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => CustomerUserService))
    private customerService: CustomerUserService,
    @Inject(forwardRef(() => EventService))
    private eventService: EventService,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>
  ) {}

  async createOrder(
    orderInput: CreateOrderInput,
    userId: string,
    paymentIntentId: string
  ): Promise<SuccessResponse> {
    const customer = await this.customerService.getCustomerById(userId)
    const { eventId } = orderInput

    await this.eventService.checkEventExistById(eventId)

    try {
      const order = this.orderRepository.create({
        ...orderInput,
        event: { id: eventId },
        customer: { id: customer.id },
        orderStatus: paymentIntentId ? OrderStatus.SUCCEEDED : OrderStatus.FAILED,
        paymentIntentId,
        stripeCustomerId: customer.stripeCustomerId,
        createdBy: userId
      } as unknown as DeepPartial<OrderEntity>)

      await this.orderRepository.save(order)

      return { success: true, message: 'Order Created' }
    } catch (error) {
      throw new BadRequestException('Order does not Created')
    }
  }

  async getOrdersOfCustomer(userId: string): Promise<OrderEntity[]> {
    await this.customerService.getCustomerById(userId)

    return await this.orderRepository.find({ where: { createdBy: userId } })
  }
}
