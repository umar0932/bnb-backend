import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'

import { EntityManager, Repository } from 'typeorm'

import { AdminService } from '@app/admin'
import { Customer } from '@app/customer-user/entities'
import { CustomerUserService } from '@app/customer-user'
import { EventService } from '@app/events'
import { JwtUserPayload } from '@app/common'

import { CreateRatingInput, ListRatingsInput } from './dto/inputs'
import { Rating } from './entities'

@Injectable()
export class RatingService {
  constructor(
    private adminService: AdminService,
    private eventService: EventService,
    private customerService: CustomerUserService,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  // Private Methods

  private async updateOrganizerAverageRating(
    transactionalManager: EntityManager,
    rating: Rating,
    customerId: string
  ): Promise<void> {
    const customer = await this.customerService.getCustomerById(customerId)
    try {
      const { averageRating } = customer
      const { organizerRating } = rating

      const scaledOrganizerRating = (Number(organizerRating) / 5) * 5

      if (averageRating === null || averageRating === undefined) {
        console.log('averageRating1---->>>', averageRating)
        await transactionalManager.update(Customer, customer.id, {
          averageRating: scaledOrganizerRating
        })
      } else {
        console.log('averageRating2---->>>', averageRating)

        const updatedAverageRating = (Number(averageRating) + scaledOrganizerRating) / 2

        const finalAverageRating = Math.min(Math.max(updatedAverageRating, 0), 5)

        await transactionalManager.update(Customer, customer.id, {
          averageRating: finalAverageRating
        })
      }
    } catch (error) {
      throw new BadRequestException('Error updating average ratings.')
    }
  }

  // Public Methods

  async getRatingById(id: string, userId: string): Promise<Rating> {
    const findRatings = await this.ratingRepository.findOne({
      where: { id, createdBy: userId }
    })
    if (!findRatings) throw new BadRequestException('Rating with the provided ID does not exist')

    return findRatings
  }

  async findFromAllRating(id: string): Promise<Rating> {
    const findRatings = await this.ratingRepository.findOne({
      where: { id }
    })
    if (!findRatings) throw new BadRequestException('Rating with the provided ID does not exist')

    return findRatings
  }

  async findUserRatingAlreadyExist(
    eventId: string,
    customerId: string,
    userId: string
  ): Promise<Rating | null> {
    const findRatings = await this.ratingRepository.findOne({
      where: { event: { id: eventId }, customer: { id: customerId }, createdBy: userId }
    })
    if (findRatings) throw new ForbiddenException('Rating has already given')

    return findRatings
  }

  // Resolver Query Methods

  async getRatingsWithPagination(
    listRatingsInput: ListRatingsInput
  ): Promise<[Rating[], number, number, number]> {
    const { limit = 10, offset = 0, filter, eventId } = listRatingsInput
    const { search } = filter || {}

    try {
      const queryBuilder = this.ratingRepository.createQueryBuilder('ratings')

      queryBuilder
        .leftJoinAndSelect('ratings.event', 'event')
        .leftJoinAndSelect('ratings.customer', 'customer')
        .orderBy('ratings.createdDate', 'DESC')
        .take(limit)
        .skip(offset)

      if (eventId) queryBuilder.andWhere('event.id = :eventId', { eventId })

      console.log(search)
      // if (search) {
      //   queryBuilder.andWhere(
      //     new Brackets(qb => {
      //       qb.where('LOWER(ratings.body) LIKE LOWER(:search)', { search: `%${search}%` })
      //     })
      //   )
      // }

      const [ratings, total] = await queryBuilder.getManyAndCount()

      return [ratings, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Rating')
    }
  }

  // Resolver Mutation Methods

  async giveRatingToOrganizer(
    createRatingInput: CreateRatingInput,
    user: JwtUserPayload
  ): Promise<Rating> {
    return this.entityManager.transaction(async transactionalManager => {
      const { userId } = user || {}
      const { eventId, customerId, ...rest } = createRatingInput

      const event = await this.eventService.getEventById(eventId, customerId)

      if (customerId === userId) throw new BadRequestException('Cannot rate yourself.')

      if (event.endDate && event.endDate > new Date())
        throw new BadRequestException('Event has not ended yet. Cannot rate organizer.')

      // await this.findUserRatingAlreadyExist(eventId, customerId, userId)

      try {
        const rating = await transactionalManager.save(Rating, {
          ...rest,
          event: { id: eventId },
          customer: { id: customerId },
          createdBy: userId
        })

        await this.updateOrganizerAverageRating(transactionalManager, rating, customerId)

        return rating
      } catch (error) {
        throw new BadRequestException('Failed to create rating')
      }
    })
  }
}
