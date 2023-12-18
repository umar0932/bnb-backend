import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { AdminService } from '@app/admin'
import { SuccessResponse } from '@app/common'

import { Category, SubCategory } from './entities'
import { CreateCategoryInput, CreateSubCategoryInput, UpdateSubCategoryInput } from './dto/inputs'

@Injectable()
export class CategoryService {
  constructor(
    private adminService: AdminService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>
  ) {}

  async getCategoryById(idCategory: number): Promise<Category> {
    try {
      const findCategory = await this.categoryRepository.findOne({ where: { idCategory } })
      if (!findCategory)
        throw new BadRequestException('Category with the provided ID does not exist')

      return findCategory
    } catch (e) {
      throw new BadRequestException('Failed to fetch category. Check the categoryId')
    }
  }

  async checkCategoryByName(categoryName: string): Promise<boolean> {
    const findCategory = await this.categoryRepository.count({
      where: { categoryName }
    })

    if (findCategory > 0) return true
    return false
  }

  async getSubCategoryById(idSubCategory: number, idCategory: number): Promise<SubCategory> {
    try {
      const findSubCategory = await this.subCategoryRepository.findOne({
        where: { idSubCategory, category: { idCategory } },
        relations: ['category']
      })
      if (!findSubCategory)
        throw new BadRequestException('SubCategory with the provided ID does not exist')

      return findSubCategory
    } catch (e) {
      throw new BadRequestException('Failed to fetch sub category. Check the subCategoryId')
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

  async createCategory(
    categoryInput: CreateCategoryInput,
    idAdminUser: string
  ): Promise<SuccessResponse> {
    await this.adminService.getAdminById(idAdminUser)

    const category = await this.checkCategoryByName(categoryInput.categoryName)
    if (category) throw new BadRequestException('Category already exists')

    await this.categoryRepository.save({
      ...categoryInput,
      createdBy: idAdminUser
    })

    return { success: true, message: 'Category Created' }
  }

  async getAllCategories(idAdminUser: string): Promise<Category[]> {
    await this.adminService.getAdminById(idAdminUser)

    return await this.categoryRepository.find({ relations: ['subCategories'] })
  }

  async updateCategories(
    categoryInput: Partial<Category>,
    idAdminUser: string
  ): Promise<Partial<Category>> {
    const { idCategory } = categoryInput

    await this.adminService.getAdminById(idAdminUser)

    if (!idCategory) throw new BadRequestException('category Id is invalid')

    try {
      const categoryData = await this.getCategoryById(idCategory)
      await this.categoryRepository.update(categoryData.idCategory, {
        ...categoryInput,
        updatedBy: idAdminUser,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    return await this.getCategoryById(idCategory)
  }

  async createSubCategory(
    createSubCategoryInput: CreateSubCategoryInput,
    idAdminUser: string
  ): Promise<SuccessResponse> {
    await this.adminService.getAdminById(idAdminUser)

    const { idCategory, subCategoryName } = createSubCategoryInput

    const category = await this.getCategoryById(idCategory)

    await this.getSubCategoryByName(subCategoryName)

    await this.subCategoryRepository.save({
      ...createSubCategoryInput,
      category,
      createdBy: idAdminUser
    })

    return { success: true, message: 'Sub Category Created' }
  }

  async getAllSubCategories(idAdminUser: string): Promise<SubCategory[]> {
    await this.adminService.getAdminById(idAdminUser)

    return await this.subCategoryRepository.find({ relations: ['category'] })
  }

  async updateSubCategories(
    updateSubCategoryInput: UpdateSubCategoryInput,
    idAdminUser: string
  ): Promise<Partial<SubCategory>> {
    const { idSubCategory, idCategory, subCategoryName } = updateSubCategoryInput
    await this.adminService.getAdminById(idAdminUser)

    const subCategoryData = await this.getSubCategoryById(idSubCategory, idCategory)

    try {
      await this.subCategoryRepository.update(subCategoryData.idSubCategory, {
        idSubCategory,
        subCategoryName,
        category: { idCategory },
        updatedBy: idAdminUser,
        updatedDate: new Date()
      })
    } catch (e) {
      throw new BadRequestException('Failed to update data')
    }

    return await this.getSubCategoryById(idSubCategory, idCategory)
  }
}
