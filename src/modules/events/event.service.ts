import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LocationsEntity } from '@app/common/entities'
import { CreateLocationInput, SuccessResponse } from '@app/common'

import { Event, EventDetailsEntity, EventTicketsEntity } from './entities'
import { CategoryService } from '@app/category'
import {
  CreateBasicEventInput,
  CreateEventTicketInput,
  EventDetailsInput,
  UpdateBasicEventInput,
  UpdateEventTicketInput
} from './dto/inputs'
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

  async getEventById(idEvent: number, userId: string): Promise<Event> {
    const findEvent = await this.eventRepository.findOne({
      where: { idEvent, createdBy: userId }
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

  async getEventTicketsById(idEventTicket: number, userId: string): Promise<EventTicketsEntity> {
    const findEventTicketsById = await this.eventTicketsRepository.findOne({
      where: { idEventTicket, createdBy: userId }
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

  async updateBasicEvent(
    updateBasicEventInput: UpdateBasicEventInput,
    userId: string
  ): Promise<SuccessResponse> {
    const { idEvent, refIdCategory, refIdSubCategory, type, location, ...rest } =
      updateBasicEventInput
    const event = await this.getEventById(idEvent, userId)
    let category, subCategory
    if (refIdCategory) category = await this.categoryService.getCategoryById(refIdCategory)

    if (refIdSubCategory && refIdCategory)
      subCategory = await this.categoryService.getSubCategoryById(refIdSubCategory, refIdCategory)

    const getlocation = await this.addLocation(location)

    if (!getlocation) throw new BadRequestException('Location has invalid inputs')

    if (type) await this.checkValidTypeEvent(type)

    const checkEventTitle = await this.getEventByName(updateBasicEventInput.eventTitle)
    if (checkEventTitle) throw new BadRequestException('Event Name already exists')

    try {
      await this.eventRepository.update(event.idEvent, {
        ...rest,
        type,
        category,
        subCategory,
        location: getlocation,
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
    const { refIdEvent, ...rest } = eventDetailsInput
    const event = await this.getEventById(refIdEvent, userId)

    try {
      if (event.eventDetails) {
        await this.eventDetailsRepository.update(event.eventDetails.idEventDetails, {
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
  ): Promise<SuccessResponse> {
    const { refIdEvent, ...rest } = createEventTicketsInput
    const event = await this.getEventById(refIdEvent, userId)
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

  async updateEventTicket(
    updateEventTicketsInput: UpdateEventTicketInput,
    userId: string
  ): Promise<SuccessResponse> {
    const { refIdEvent, idEventTicket, ...rest } = updateEventTicketsInput
    const event = await this.getEventById(refIdEvent, userId)
    const ticketData = await this.getEventTicketsById(idEventTicket, userId)

    try {
      await this.eventTicketsRepository.update(ticketData.idEventTicket, {
        ...rest,
        event,
        updatedBy: userId,
        updatedDate: new Date()
      })
    } catch (error) {
      throw new BadRequestException('Failed to update Tickets')
    }

    return { success: true, message: 'Event Tickets updated' }
  }
}
