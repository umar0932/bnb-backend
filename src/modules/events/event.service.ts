import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { Brackets, Repository } from 'typeorm'
import { uuid } from 'uuidv4'

import { AwsS3ClientService } from '@app/aws-s3-client'
import { LocationsEntity } from '@app/common/entities'
import { CreateLocationInput, SuccessResponse } from '@app/common'
import { CustomerUserService } from '@app/customer-user'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'

import { Event, EventDetailsEntity } from './entities'
import { CategoryService } from '@app/category'
import {
  CreateBasicEventInput,
  EventDetailsInput,
  ListEventsInputs,
  ListOrganizerEventsInputs,
  PublishOrUnPublishEventInput,
  UpdateBasicEventInput
} from './dto/inputs'
import { EventLocationType, EventStatus, Type } from './event.constants'

@Injectable()
export class EventService {
  constructor(
    private categoryService: CategoryService,
    private configService: ConfigService,
    @Inject(forwardRef(() => CustomerUserService))
    private customerService: CustomerUserService,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventDetailsEntity)
    private eventDetailsRepository: Repository<EventDetailsEntity>,
    @InjectRepository(LocationsEntity)
    private locationRepository: Repository<LocationsEntity>,
    private s3Service: AwsS3ClientService
  ) {}

  // Private Methods

  // Public Methods

  async getEventByName(title: string): Promise<boolean> {
    const findEventByName = await this.eventRepository.count({ where: { title } })
    if (findEventByName > 0) return true
    return false
  }

  async findFromAllEvents(id: string): Promise<Event> {
    const findEvent = await this.eventRepository.findOne({
      where: { id }
    })
    if (!findEvent) throw new NotFoundException('Event with the provided ID does not exist')

    return findEvent
  }

  async checkValidTypeEvent(type: string): Promise<boolean> {
    if (Object.values(Type).includes(type)) return true
    else throw new BadRequestException('Invalid type')
  }

  async addLocation(createLocationInput: CreateLocationInput): Promise<LocationsEntity> {
    try {
      const location = await this.locationRepository.save({ ...createLocationInput })
      return location
    } catch (error) {
      throw new BadRequestException('Failed to create location')
    }
  }

  async updateEventTotalTickets(
    event: Event,
    totalTicketsSold: number,
    ticketsGrossTotal: number
  ): Promise<void> {
    try {
      await this.eventRepository.update(
        { id: event.id },
        {
          totalTicketsSold: event.totalTicketsSold
            ? Number(event.totalTicketsSold || 0) + totalTicketsSold
            : totalTicketsSold,
          ticketsGrossTotal: event.ticketsGrossTotal
            ? Number(event.ticketsGrossTotal || 0) + ticketsGrossTotal
            : ticketsGrossTotal
        }
      )
    } catch (error) {
      throw new BadRequestException('Failed to update event total tickets')
    }
  }

  // Resolver Query Methods

  async getEventById(id: string, userId: string): Promise<Event> {
    const findEvent = await this.eventRepository.findOne({
      where: { id, createdBy: userId }
    })

    if (!findEvent) throw new BadRequestException('Event with the provided ID does not exist')

    return findEvent
  }

  async getEventUploadUrls(count: number): Promise<S3SignedUrlResponse[]> {
    if (!count) throw new BadRequestException('Count cannot be less than 1')
    const urls: S3SignedUrlResponse[] = []

    for (let i = 0; i < count; i++) {
      const key = `user_event_image_uploads/${uuid()}-event-upload`
      const bucketName = this.configService.get('USER_UPLOADS_BUCKET')

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key
      })
      const url = await getSignedUrl(this.s3Service.getClient(), command, {
        expiresIn: 3600
      })
      urls.push({
        signedUrl: url,
        fileName: key
      })
    }

    return urls
  }

  async getEventsWithPagination(
    listEventsInputs: ListEventsInputs
  ): Promise<[Event[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listEventsInputs
    const { title, search, categoryName, online, eventToday, eventTomorrow, eventWeekend, onSite } =
      filter || {}

    try {
      const queryBuilder = this.eventRepository.createQueryBuilder('event')

      queryBuilder
        .leftJoinAndSelect('event.category', 'category')
        .leftJoinAndSelect('event.subCategory', 'subCategory')
        .leftJoinAndSelect('event.location', 'location')
        .leftJoinAndSelect('event.eventDetails', 'eventDetails')
        .leftJoinAndSelect('event.eventTickets', 'eventTickets')
        .leftJoinAndSelect('event.orders', 'eventorders')
        .leftJoinAndSelect('eventorders.customer', 'customerorder')
        .take(limit)
        .skip(offset)

      queryBuilder.andWhere('event.status = :published', {
        published: EventStatus.PUBLISHED
      })
      title && queryBuilder.andWhere('event.title = :title', { title })
      online &&
        queryBuilder.andWhere('event.eventLocationType = :online', {
          online: EventLocationType.ONLINE
        })
      onSite &&
        queryBuilder.andWhere('event.eventLocationType = :onSite', {
          onSite: EventLocationType.ONSITE
        })

      if (categoryName)
        queryBuilder.andWhere('event.category.categoryName = :categoryName', { categoryName })

      if (eventToday) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        queryBuilder.andWhere('DATE(event.startDate) = :today', { today })
      }

      if (eventTomorrow) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        queryBuilder.andWhere('DATE(event.startDate) = :tomorrow', { tomorrow })
      }

      if (eventWeekend) {
        const today = new Date()
        const startOfWeekend = new Date(today)
        startOfWeekend.setDate(startOfWeekend.getDate() + (5 - today.getDay()))
        const endOfWeekend = new Date(today)
        endOfWeekend.setDate(endOfWeekend.getDate() + (7 - today.getDay()))
        queryBuilder.andWhere(
          'DATE(event.startDate) >= :startOfWeekend AND DATE(event.startDate) <= :endOfWeekend',
          {
            startOfWeekend,
            endOfWeekend
          }
        )
      }

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(event.title) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(location.city) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(location.country) LIKE LOWER(:search)', { search: `${search}` })
          })
        )
      }

      const [events, total] = await queryBuilder.getManyAndCount()

      return [events, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Events')
    }
  }

  async getEventsWithPaginationOrganizer(
    listOrganizerEventsInputs: ListOrganizerEventsInputs
  ): Promise<[Event[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listOrganizerEventsInputs
    const { title, search, upcomingEvents, pastEvents, draft, published } = filter || {}

    try {
      const queryBuilder = this.eventRepository.createQueryBuilder('event')

      queryBuilder
        .leftJoinAndSelect('event.category', 'category')
        .leftJoinAndSelect('event.subCategory', 'subCategory')
        .leftJoinAndSelect('event.location', 'location')
        .leftJoinAndSelect('event.eventDetails', 'eventDetails')
        .leftJoinAndSelect('event.eventTickets', 'eventTickets')
        .leftJoinAndSelect('event.orders', 'eventorders')
        .leftJoinAndSelect('eventorders.customer', 'customerorder')
        .take(limit)
        .skip(offset)

      title && queryBuilder.andWhere('event.title = :title', { title })

      draft &&
        queryBuilder.andWhere('event.status = :draft', {
          draft: EventStatus.DRAFT
        })
      published &&
        queryBuilder.andWhere('event.status = :published', {
          published: EventStatus.PUBLISHED
        })
      if (upcomingEvents) {
        const currentDate = new Date()
        queryBuilder.andWhere('event.startDate >= :currentDate', { currentDate })
      }
      if (pastEvents) {
        const currentDate = new Date()
        queryBuilder.andWhere('event.startDate <= :currentDate', { currentDate })
      }

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(event.title) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(location.city) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(location.country) LIKE LOWER(:search)', { search: `${search}` })
          })
        )
      }

      const [events, total] = await queryBuilder.getManyAndCount()

      return [events, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Events')
    }
  }

  // Resolver Mutation Methods

  async createBasicEvent(
    createBasicEventInput: CreateBasicEventInput,
    userId: string
  ): Promise<Event> {
    const { title, categoryId, subCategoryId, type, location, eventLocationType, meetingUrl } =
      createBasicEventInput

    let category, subCategory
    if (categoryId) category = await this.categoryService.getCategoryById(categoryId)

    if (subCategoryId && categoryId)
      subCategory = await this.categoryService.getSubCategoryById(subCategoryId, categoryId)

    const getlocation = await this.addLocation(location)

    if (!getlocation) throw new BadRequestException('Location has invalid inputs')

    if (type) await this.checkValidTypeEvent(type)

    const event = await this.getEventByName(title)
    if (event) throw new BadRequestException('Event Name already exists')

    if (eventLocationType === EventLocationType.ONLINE && !meetingUrl)
      throw new BadRequestException('Meeting URL is required for online events')

    try {
      const event = await this.eventRepository.save({
        ...createBasicEventInput,
        title,
        eventLocationType,
        meetingUrl,
        category,
        subCategory,
        location: getlocation,
        createdBy: userId
      })
      return event
    } catch (error) {
      throw new BadRequestException('Failed to create event')
    }
  }

  async updateBasicEvent(
    updateBasicEventInput: UpdateBasicEventInput,
    userId: string
  ): Promise<Event> {
    const { id, categoryId, subCategoryId, title, type, location, ...rest } = updateBasicEventInput
    const event = await this.getEventById(id, userId)
    let category, subCategory
    if (categoryId) category = await this.categoryService.getCategoryById(categoryId)

    if (subCategoryId && categoryId)
      subCategory = await this.categoryService.getSubCategoryById(subCategoryId, categoryId)

    if (location) {
      const getlocation = await this.addLocation(location)
      if (!getlocation) throw new BadRequestException('Location has invalid inputs')
    }
    if (type) await this.checkValidTypeEvent(type)

    if (title) {
      const checkEventTitle = await this.getEventByName(title)
      if (checkEventTitle) throw new BadRequestException('Event Name already exists')
    }
    try {
      await this.eventRepository.update(event.id, {
        ...rest,
        title,
        type,
        category,
        subCategory,
        location,
        updatedBy: userId,
        updatedDate: new Date()
      })
    } catch (error) {
      throw new BadRequestException('Failed to update Event')
    }

    return await this.getEventById(id, userId)
  }

  async createOrUpdateEventDetails(
    eventDetailsInput: EventDetailsInput,
    userId: string
  ): Promise<SuccessResponse> {
    const { eventId, ...rest } = eventDetailsInput
    const event = await this.getEventById(eventId, userId)

    try {
      if (event.eventDetails) {
        await this.eventDetailsRepository.update(event.eventDetails?.id, {
          ...rest,
          event,
          updatedBy: userId,
          updatedDate: new Date()
        })
      } else {
        await this.eventDetailsRepository.save({
          ...rest,
          event,
          createdBy: userId
        })
      }
    } catch (error) {
      throw new BadRequestException('Failed to create or update event details')
    }

    return { success: true, message: 'Event Details Created or Updated' }
  }

  async publishOrUnPublishEvent(
    publishOrUnPublishEventInput: PublishOrUnPublishEventInput,
    userId: string
  ): Promise<Event> {
    const { eventId, publish } = publishOrUnPublishEventInput
    const event = await this.getEventById(eventId, userId)

    if (!event.eventDetails) throw new BadRequestException('Event Details cannot be empty')
    if (!event.eventTickets) throw new BadRequestException('Event Tickets cannot be empty')

    try {
      await this.eventRepository.update(event.id, {
        status: publish ? EventStatus.PUBLISHED : EventStatus.DRAFT,
        updatedBy: userId,
        updatedDate: new Date()
      })

      return await this.getEventById(eventId, userId)
    } catch (error) {
      throw new BadRequestException('Failed to update Event')
    }
  }
}
