import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload, SuccessResponse } from '@app/common'

import { Category, SubCategory } from './entities'
import {
  CreateCategoryInput,
  CreateSubCategoryInput,
  UpdateCategoryInput,
  UpdateSubCategoryInput
} from './dto/inputs'
import { CategoryService } from './category.service'

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => SuccessResponse, {
    description: 'This will crete new Categories'
  })
  @Allow()
  async createCategory(
    @Args('input') createCategoryData: CreateCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.categoryService.createCategory(createCategoryData, user.userId)
  }

  @Query(() => [Category], { description: 'This will get all categories' })
  @Allow()
  getAllCategories(@CurrentUser() user: JwtUserPayload): Promise<Category[]> {
    return this.categoryService.getAllCategories(user.userId)
  }

  @Mutation(() => Category, { description: 'This will update Category' })
  @Allow()
  async updateCategory(
    @Args('input') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Partial<Category>> {
    return await this.categoryService.updateCategories(updateCategoryInput, user.userId)
  }

  @Mutation(() => SuccessResponse, {
    description: 'This will crete new SubCategories'
  })
  @Allow()
  async createSubCategory(
    @Args('input') createSubCategoryInput: CreateSubCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SuccessResponse> {
    return await this.categoryService.createSubCategory(createSubCategoryInput, user.userId)
  }

  @Query(() => [SubCategory], { description: 'This will get all categories' })
  @Allow()
  getAllSubCategories(@CurrentUser() user: JwtUserPayload): Promise<SubCategory[]> {
    return this.categoryService.getAllSubCategories(user.userId)
  }

  @Mutation(() => SubCategory, { description: 'This will update SubCategory' })
  @Allow()
  async updateSubCategories(
    @Args('input') updateSubCategoryInput: UpdateSubCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Partial<SubCategory>> {
    return await this.categoryService.updateSubCategories(updateSubCategoryInput, user.userId)
  }
}
