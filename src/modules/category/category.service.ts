import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Brackets, Repository } from 'typeorm'

import { AdminService } from '@app/admin'

import { Category, SubCategory } from './entities'
import {
  CreateCategoryInput,
  CreateSubCategoryInput,
  ListCategoriesInput,
  ListSubCategoriesInput,
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

  // Private Methods

  // Public Methods

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

  // Resolver Query Methods

  async getCategoriesWithPagination(
    listCategoriesInput: ListCategoriesInput
  ): Promise<[Category[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listCategoriesInput
    const { search } = filter || {}

    try {
      const queryBuilder = this.categoryRepository.createQueryBuilder('category')

      queryBuilder
        .leftJoinAndSelect('category.subCategories', 'subCategories')
        .orderBy('category.createdDate', 'DESC')
        .take(limit)
        .skip(offset)

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(posts.body) LIKE LOWER(:search)', { search: `%${search}%` })
          })
        )
      }

      const [categories, total] = await queryBuilder.getManyAndCount()

      return [categories, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find category')
    }
  }

  async getSubCategoriesWithPagination(
    listSubCategoriesInput: ListSubCategoriesInput
  ): Promise<[SubCategory[], number, number, number]> {
    const { limit = 10, offset = 0, filter } = listSubCategoriesInput
    const { search } = filter || {}

    try {
      const queryBuilder = this.subCategoryRepository.createQueryBuilder('subCategory')

      queryBuilder.orderBy('subCategory.createdDate', 'DESC').take(limit).skip(offset)

      if (search) {
        queryBuilder.andWhere(
          new Brackets(qb => {
            qb.where('LOWER(posts.body) LIKE LOWER(:search)', { search: `%${search}%` })
          })
        )
      }

      const [subCategories, total] = await queryBuilder.getManyAndCount()

      return [subCategories, total, limit, offset]
    } catch (error) {
      throw new BadRequestException('Failed to find subCategory')
    }
  }

  async getAllCategories(id: string): Promise<Category[]> {
    await this.adminService.getAdminById(id)

    return await this.categoryRepository.find({ relations: ['subCategories'] })
  }

  // Resolver Mutation Methods

  async createCategory(categoryInput: CreateCategoryInput, id: string): Promise<Category> {
    await this.adminService.getAdminById(id)

    const categoryName = await this.checkCategoryByName(categoryInput.categoryName)
    if (categoryName) throw new BadRequestException('Category name already exists')

    const category = await this.categoryRepository.save({
      ...categoryInput,
      createdBy: id
    })

    return category
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
  ): Promise<SubCategory> {
    await this.adminService.getAdminById(userId)

    const { categoryId, subCategoryName } = createSubCategoryInput

    const category = await this.getCategoryById(categoryId)

    await this.getSubCategoryByName(subCategoryName)

    const subCategory = await this.subCategoryRepository.save({
      ...createSubCategoryInput,
      category,
      createdBy: userId
    })

    return subCategory
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
