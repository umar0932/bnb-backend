import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { AdminService } from '@app/admin'
import { SuccessResponse } from '@app/common'

import { Category, SubCategory } from './entities'
import {
  CreateCategoryInput,
  CreateSubCategoryInput,
  UpdateCategoryInput,
  UpdateSubCategoryInput
} from './dto/inputs'

@Injectable()
export class CategoryService {
  constructor(
    private adminService: AdminService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>
  ) {}

  async getCategoryById(id: string): Promise<Category> {
    const findCategoryById = await this.categoryRepository.findOne({ where: { id } })
    if (!findCategoryById)
      throw new BadRequestException('Category with the provided ID does not exist')

    return findCategoryById
  }

  async checkCategoryByName(categoryName: string): Promise<boolean> {
    const findCategory = await this.categoryRepository.count({
      where: { categoryName }
    })

    if (findCategory > 0) return true
    return false
  }

  async getSubCategoryById(id: string, categoryId: string): Promise<SubCategory> {
    try {
      const findSubCategory = await this.subCategoryRepository.findOne({
        where: { id, category: { id: categoryId } },
        relations: ['category']
      })
      if (!findSubCategory)
        throw new BadRequestException('SubCategory with the provided ID does not exist')

      return findSubCategory
    } catch (e) {
      throw new BadRequestException('SubCategory with the provided ID does not exist')
    }
  }

  async getSubCategoryByName(subCategoryName: string): Promise<boolean> {
    const findSubCategory = await this.subCategoryRepository.findOne({
      where: { subCategoryName },
      relations: ['category']
    })
    if (findSubCategory)
      throw new BadRequestException(
        'SubCategory name already exist. Please enter valid sub category name'
      )

    return true
  }

  async createCategory(categoryInput: CreateCategoryInput, id: string): Promise<SuccessResponse> {
    await this.adminService.getAdminById(id)

    const category = await this.checkCategoryByName(categoryInput.categoryName)
    if (category) throw new BadRequestException('Category already exists')

    await this.categoryRepository.save({
      ...categoryInput,
      createdBy: id
    })

    return { success: true, message: 'Category Created' }
  }

  async getAllCategories(id: string): Promise<Category[]> {
    await this.adminService.getAdminById(id)

    return await this.categoryRepository.find({ relations: ['subCategories'] })
  }

  async updateCategories(
    updateCategoryInput: UpdateCategoryInput,
    userId: string
  ): Promise<Partial<Category>> {
    const { id } = updateCategoryInput

    await this.adminService.getAdminById(userId)

    if (!id) throw new BadRequestException('category Id is invalid')

    try {
      const categoryData = await this.getCategoryById(id)
      await this.categoryRepository.update(categoryData.id, {
        ...updateCategoryInput,
        updatedBy: id,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    return await this.getCategoryById(id)
  }

  async createSubCategory(
    createSubCategoryInput: CreateSubCategoryInput,
    userId: string
  ): Promise<SuccessResponse> {
    await this.adminService.getAdminById(userId)

    const { categoryId, subCategoryName } = createSubCategoryInput

    const category = await this.getCategoryById(categoryId)

    await this.getSubCategoryByName(subCategoryName)

    await this.subCategoryRepository.save({
      ...createSubCategoryInput,
      category,
      createdBy: userId
    })

    return { success: true, message: 'Sub Category Created' }
  }

  async getAllSubCategories(id: string): Promise<SubCategory[]> {
    await this.adminService.getAdminById(id)

    return await this.subCategoryRepository.find({ relations: ['category'] })
  }

  async updateSubCategories(
    updateSubCategoryInput: UpdateSubCategoryInput,
    userId: string
  ): Promise<Partial<SubCategory>> {
    const { id, categoryId, subCategoryName } = updateSubCategoryInput
    await this.adminService.getAdminById(userId)

    let category

    const subCategoryData = await this.getSubCategoryById(id, categoryId)
    if (categoryId) category = await this.getCategoryById(categoryId)

    try {
      await this.subCategoryRepository.update(subCategoryData.id, {
        id,
        subCategoryName,
        category,
        updatedBy: userId,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    return await this.getSubCategoryById(id, id)
  }
}
