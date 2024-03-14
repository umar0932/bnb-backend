import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'

import { Brackets, EntityManager, Repository } from 'typeorm'

import { Event } from '@app/events/entities'
import { EventService } from '@app/events'
import { JWT_STRATEGY_NAME, JwtUserPayload } from '@app/common'

import { CreateLikeInput, ListLikesInput, UpdateLikeInput } from './dto/inputs'
import { Likes } from './entities'

@Injectable()
export class LikeService {
  constructor(
    private eventService: EventService,
    @InjectRepository(Likes)
    private likeRepository: Repository<Likes>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  // Private Methods

  private async updateTotalLikeCount(
    transactionalManager: EntityManager,
    event: Event,
    method: string,
    userId: string
  ): Promise<void> {
    try {
      if (method === 'increment') {
        await transactionalManager.update(Event, event.id, {
          likeCount: Number(event.likeCount || 0) + 1,
          updatedBy: userId,
          updatedDate: new Date()
        })
      } else if (method === 'decrement') {
        await transactionalManager.update(Event, event.id, {
          likeCount: Math.max(Number(event.likeCount || 0) - 1, 0),
          updatedBy: userId,
          updatedDate: new Date()
        })
      } else {
        throw new BadRequestException('Invalid method.')
      }
    } catch (error) {
      throw new BadRequestException('Error updating like count.')
    }
  }

  // Public Methods

  async getLikeById(id: string): Promise<Likes> {
    const findLikes = await this.likeRepository.findOne({
      where: { id }
    })
    if (!findLikes) throw new BadRequestException('Likes with the provided ID does not exist')

    return findLikes
  }

  async findFromAllLike(id: string): Promise<Likes> {
    const findLikes = await this.likeRepository.findOne({
      where: { id }
    })
    if (!findLikes) throw new BadRequestException('Likes with the provided ID does not exist')

    return findLikes
  }

  // Resolver Query Methods

  async getLikesWithPagination(
    listEventsInput: ListLikesInput,
    user: JwtUserPayload
  ): Promise<[Likes[], number, number, number]> {
    const { limit = 10, offset = 0, filter, customerId, eventId } = listEventsInput
    const { search } = filter || {}
    const { userId, type } = user || {}

    try {
      const queryBuilder = this.likeRepository.createQueryBuilder('likes')

      queryBuilder
        .leftJoinAndSelect('likes.event', 'event')
        .leftJoinAndSelect('likes.user', 'userlikes')
        .orderBy('likes.createdDate', 'DESC')
        .take(limit)
        .skip(offset)

      if (eventId) {
        queryBuilder.andWhere('event.id = :eventId', { eventId })
      } else if (type === JWT_STRATEGY_NAME.ADMIN) {
        if (customerId) queryBuilder.where('userlikes.id = :customerId', { customerId })
      } else queryBuilder.where('userlikes.id = :userId', { userId })

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(userlikes.firstName) LIKE LOWER(:search)', {
              search: `%${search}%`
            }).orWhere('LOWER(userlikes.lastName) LIKE LOWER(:search)', {
              search: `%${search}%`
            })
          })
        )
      }

      const [likes, total] = await queryBuilder.getManyAndCount()

      return [likes, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find like')
    }
  }

  // Resolver Mutation Methods

  async likeEvent(createLikeInput: CreateLikeInput, user: JwtUserPayload): Promise<Partial<Likes>> {
    return this.manager.transaction(async transactionalManager => {
      const { eventId, ...rest } = createLikeInput
      const { userId } = user || {}

      const event = await this.eventService.findFromAllEvents(eventId)

      const alreadyLiked = event.likes?.some(like => like.user.id === userId)
      if (alreadyLiked) throw new BadRequestException('User has already liked this event')

      try {
        const likes = await transactionalManager.save(Likes, {
          ...rest,
          event: { id: eventId },
          user: { id: userId },
          createdBy: userId
        })

        await this.updateTotalLikeCount(transactionalManager, event, 'increment', userId)

        return likes
      } catch (error) {
        throw new BadRequestException('Failed to create like')
      }
    })
  }

  async unlikeEvent(
    updateLikeInput: UpdateLikeInput,
    user: JwtUserPayload
  ): Promise<Partial<Likes>> {
    return this.manager.transaction(async transactionalManager => {
      const { eventId } = updateLikeInput
      const { userId } = user || {}

      const event = await this.eventService.findFromAllEvents(eventId)

      const existingLike = await transactionalManager.findOne(Likes, {
        where: {
          user: { id: userId },
          event: { id: eventId }
        }
      })

      if (!existingLike) throw new BadRequestException('User has not liked this event')

      try {
        await transactionalManager.remove(existingLike)

        await this.updateTotalLikeCount(transactionalManager, event, 'decrement', userId)

        return await this.getLikeById(existingLike.id)
      } catch (error) {
        throw new BadRequestException('Failed to update like')
      }
    })
  }
}
