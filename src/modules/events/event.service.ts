import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { Brackets, Repository } from 'typeorm'
import { uuid } from 'uuidv4'

import { LocationsEntity } from '@app/common/entities'
import { CreateLocationInput, SuccessResponse } from '@app/common'
import { S3SignedUrlResponse } from '@app/aws-s3-client/dto/args'
import { AwsS3ClientService } from '@app/aws-s3-client'

import { Event, EventDetailsEntity, Tickets } from './entities'
import { CategoryService } from '@app/category'
import {
  CreateBasicEventInput,
  CreateEventTicketInput,
  EventDetailsInput,
  ListEventTicketsInputs,
  ListEventsInputs,
  UpdateBasicEventInput,
  UpdateEventTicketInput
} from './dto/inputs'
import { EventLocationType, Type } from './event.constants'

@Injectable()
export class EventService {
  constructor(
    private categoryService: CategoryService,
    private configService: ConfigService,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventDetailsEntity)
    private eventDetailsRepository: Repository<EventDetailsEntity>,
    @InjectRepository(Tickets)
    private eventTicketsRepository: Repository<Tickets>,
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

  async checkEventExistById(id: string): Promise<boolean> {
    const findEventExistById = await this.eventRepository.count({ where: { id } })
    if (!findEventExistById)
      throw new BadRequestException('Event with the provided ID does not exist')
    return true
  }

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
    const { title, search, categoryName, online } = filter || {}

    try {
      const queryBuilder = this.eventRepository.createQueryBuilder('event')

      title && queryBuilder.andWhere('event.title = :title', { title })
      online && queryBuilder.andWhere('event.online = :online', { online })

      if (categoryName)
        queryBuilder.andWhere('category.categoryName = :categoryName', { categoryName })

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(event.title) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(location.city) LIKE LOWER(:search)', { search: `${search}` })
              .orWhere('LOWER(location.country) LIKE LOWER(:search)', { search: `${search}` })
          })
        )
      }

      const [events, total] = await queryBuilder
        .leftJoinAndSelect('event.category', 'category')
        .leftJoinAndSelect('event.subCategory', 'subCategory')
        .leftJoinAndSelect('event.location', 'location')
        .leftJoinAndSelect('event.eventDetails', 'eventDetails')
        .leftJoinAndSelect('event.eventTickets', 'eventTickets')
        .leftJoinAndSelect('event.orders', 'eventorders')
        .leftJoinAndSelect('eventorders.customer', 'customerorder')
        .take(limit)
        .skip(offset)
        .getManyAndCount()

      return [events, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Events')
    }
  }

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
        .leftJoinAndSelect('eventTickets.event.category', 'category')
        .take(limit)
        .skip(offset)
        .getManyAndCount()

      return [eventTickets, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find Events')
    }
  }

  // Resolver Mutation Methods

  async createBasicEvent(
    createBasicEventInput: CreateBasicEventInput,
    userId: string
  ): Promise<SuccessResponse> {
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
      await this.eventRepository.save({
        ...createBasicEventInput,
        title,
        eventLocationType,
        meetingUrl,
        category,
        subCategory,
        location: getlocation,
        createdBy: userId
      })
    } catch (error) {
      throw new BadRequestException('Failed to create event')
    }

    return { success: true, message: 'Event Created' }
  }

  async updateBasicEvent(
    updateBasicEventInput: UpdateBasicEventInput,
    userId: string
  ): Promise<SuccessResponse> {
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

    return { success: true, message: 'Event updated' }
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

  async createEventTicket(
    createEventTicketsInput: CreateEventTicketInput,
    userId: string
  ): Promise<Tickets> {
    const { eventId, ...rest } = createEventTicketsInput
    await this.getEventById(eventId, userId)
    const ticketData = await this.getEventTicketsByName(createEventTicketsInput.title, userId)
    if (ticketData)
      throw new BadRequestException('This Ticket name already exist. Enter a valid name')
    try {
      const ticket = await this.eventTicketsRepository.save({
        ...rest,
        event: { id: eventId },
        createdBy: userId
      })

      return ticket
    } catch (error) {
      throw new BadRequestException('Failed to create Ticketss')
    }
  }

  async updateEventTicket(
    updateEventTicketsInput: UpdateEventTicketInput,
    userId: string
  ): Promise<Tickets> {
    const { eventId, id, ...rest } = updateEventTicketsInput
    await this.getEventById(eventId, userId)
    const ticketData = await this.getEventTicketsById(id, userId)

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
}
