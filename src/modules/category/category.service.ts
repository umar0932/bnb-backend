import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { AdminService } from '@app/admin'
import { SuccessResponse } from '@app/common'

import { Category, SubCategory } from './entities'
import { CreateCategoryInput } from './dto/inputs'

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
      const findCategory = this.categoryRepository.findOne({ where: { idCategory } })
      if (!findCategory)
        throw new BadRequestException('Unable to find the category. Please enter valid category id')

      return findCategory
    } catch (e) {
      throw new BadRequestException('Failed to fetch category. Check the categoryId')
    }
  }

  async getCategoryByName(categoryName: string): Promise<Category> {
    const findCategory = this.categoryRepository.findOne({
      where: { categoryName }
    })

    return findCategory
  }

  async createCategory(
    categoryInput: CreateCategoryInput,
    idAdminUser: string
  ): Promise<SuccessResponse> {
    await this.adminService.getAdminById(idAdminUser)

    const category = await this.getCategoryByName(categoryInput.categoryName)
    if (category) throw new BadRequestException('Category already exists')

    await this.categoryRepository.save({
      ...categoryInput,
      createdBy: idAdminUser
    })

    return { success: true, message: 'Category Created' }
  }

  async getAllCategories(idAdminUser: string): Promise<Category[]> {
    await this.adminService.getAdminById(idAdminUser)

    return await this.categoryRepository.find()
  }

  async updateCategories(
    categoryInput: Partial<Category>,
    idAdminUser: string
  ): Promise<Partial<Category>> {
    const { idCategory } = categoryInput

    await this.adminService.getAdminById(idAdminUser)

    const categoryData = await this.getCategoryById(idCategory)

    try {
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
}
