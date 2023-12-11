import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { LocationsEntity } from '@app/common/entities'
import { CreateLocationInput, SuccessResponse } from '@app/common'

import { Event } from './entities'
import { CategoryService } from '@app/category'
import { CreateEventInput } from './dto/inputs'
import { Type } from './event.constants'

@Injectable()
export class EventService {
  constructor(
    private categoryService: CategoryService,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(LocationsEntity)
    private locationRepository: Repository<LocationsEntity>
  ) {}

  async getEventById(idEvent: number): Promise<Event> {
    try {
      const findEvent = await this.eventRepository.findOne({ where: { idEvent } })
      if (!findEvent)
        throw new BadRequestException('Unable to find the event. Please enter valid event id')

      return findEvent
    } catch (e) {
      throw new BadRequestException('Failed to fetch event. Check the eventId')
    }
  }

  async getEventByName(eventTitle: string): Promise<Event> {
    try {
      const findEvent = await this.eventRepository.findOne({ where: { eventTitle } })
      if (!findEvent)
        throw new BadRequestException('Unable to find the event. Please enter valid event name')

      return findEvent
    } catch (e) {
      throw new BadRequestException('Failed to fetch event. Check the eventName')
    }
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

  async createEvent(createEventInput: CreateEventInput, userId: string): Promise<SuccessResponse> {
    const { eventTitle, refIdCategory, refIdSubCategory, type, location } = createEventInput
    let category, subCategory
    if (refIdCategory) {
      category = await this.categoryService.getCategoryById(refIdCategory)
      if (!category) throw new BadRequestException('Category with the provided ID does not exist')
    }
    if (refIdSubCategory && refIdCategory) {
      subCategory = await this.categoryService.getSubCategoryById(refIdSubCategory, refIdCategory)
      if (!subCategory)
        throw new BadRequestException('SubCategory with the provided ID does not exist')
    }

    const getlocation = await this.addLocation(location)

    if (!getlocation) throw new BadRequestException('Location has invalid inputs')

    if (type) await this.checkValidTypeEvent(type)

    const event = await this.getEventByName(eventTitle)
    if (event) throw new BadRequestException('Event Name already exists')

    try {
      await this.eventRepository.save({
        ...createEventInput,
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
}
