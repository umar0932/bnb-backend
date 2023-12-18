import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LocationsEntity } from '@app/common/entities'
import { CreateLocationInput, SuccessResponse } from '@app/common'

import { Event, EventDetailsEntity, EventTicketsEntity } from './entities'
import { CategoryService } from '@app/category'
import { CreateBasicEventInput, CreateEventTicketsInput, EventDetailsInput } from './dto/inputs'
import { Type } from './event.constants'

@Injectable()
export class EventService {
  constructor(
    private categoryService: CategoryService,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(EventDetailsEntity)
    private eventDetailsRepository: Repository<EventDetailsEntity>,
    @InjectRepository(EventTicketsEntity)
    private eventTicketsRepository: Repository<EventTicketsEntity>,
    @InjectRepository(LocationsEntity)
    private locationRepository: Repository<LocationsEntity>
  ) {}

  async getEventById(idEvent: number): Promise<Event> {
    const findEvent = await this.eventRepository.findOne({
      where: { idEvent }
    })
    if (!findEvent) throw new BadRequestException('Event with the provided ID does not exist')

    return findEvent
  }

  async getEventByName(eventTitle: string): Promise<boolean> {
    const findEventByName = await this.eventRepository.count({ where: { eventTitle } })
    if (findEventByName > 0) return true
    return false
  }

  async getEventTicketsByName(ticketName: string, customerId: string): Promise<boolean> {
    const findEventTickets = await this.eventTicketsRepository.count({
      where: { ticketName, createdBy: customerId }
    })
    if (findEventTickets > 0) return true
    return false
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

  async createBasicEvent(
    createBasicEventInput: CreateBasicEventInput,
    userId: string
  ): Promise<SuccessResponse> {
    const { eventTitle, refIdCategory, refIdSubCategory, type, location } = createBasicEventInput
    let category, subCategory
    if (refIdCategory) category = await this.categoryService.getCategoryById(refIdCategory)

    if (refIdSubCategory && refIdCategory)
      subCategory = await this.categoryService.getSubCategoryById(refIdSubCategory, refIdCategory)

    const getlocation = await this.addLocation(location)

    if (!getlocation) throw new BadRequestException('Location has invalid inputs')

    if (type) await this.checkValidTypeEvent(type)

    const event = await this.getEventByName(eventTitle)
    if (event) throw new BadRequestException('Event Name already exists')

    try {
      await this.eventRepository.save({
        ...createBasicEventInput,
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

  async createOrUpdateEventDetails(
    eventDetailsInput: EventDetailsInput,
    userId: string
  ): Promise<SuccessResponse> {
    const { refIdEvent, ...rest } = eventDetailsInput
    const event = await this.getEventById(refIdEvent)

    try {
      if (event.eventDetails) {
        await this.eventDetailsRepository.update(event.eventDetails.idEventDetails, {
          ...rest,
          event,
          updatedBy: userId,
          updatedDate: new Date()
        })
      } else {
        const newEventDetails = await this.eventDetailsRepository.save({
          ...rest,
          event,
          createdBy: userId
        })

        await this.eventRepository.update(refIdEvent, {
          eventDetails: newEventDetails,
          createdBy: userId
        })
      }
    } catch (error) {
      console.log(error)

      throw new BadRequestException('Failed to create or update event details')
    }

    return { success: true, message: 'Event Details Created or Updated' }
  }

  async createEventTickets(
    createEventTicketsInput: CreateEventTicketsInput,
    userId: string
  ): Promise<SuccessResponse> {
    const { refIdEvent, ...rest } = createEventTicketsInput
    const event = await this.getEventById(refIdEvent)
    const ticketData = await this.getEventTicketsByName(createEventTicketsInput.ticketName, userId)
    if (ticketData)
      throw new BadRequestException('This Ticket name already exist. Enter a valid name')
    try {
      await this.eventTicketsRepository.save({
        ...rest,
        event,
        createdBy: userId
      })
    } catch (error) {
      throw new BadRequestException('Failed to create Ticketss')
    }

    return { success: true, message: 'Event Tickets created' }
  }
}
