import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { Allow, CurrentUser, SuccessResponse } from '@app/common'

import { Category } from './entities'
import { CreateCategoryInput, UpdateCategoryInput } from './dto/inputs'
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
    @CurrentUser() user: any
  ): Promise<SuccessResponse> {
    return await this.categoryService.createCategory(createCategoryData, user.userId)
  }

  @Query(() => [Category], { description: 'This will get all categories' })
  @Allow()
  getAllCategories(@CurrentUser() user: any): Promise<Category[]> {
    return this.categoryService.getAllCategories(user.userId)
  }

  @Mutation(() => Category, { description: 'This will update Category' })
  @Allow()
  async updateCategory(
    @Args('input') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser() user: any
  ): Promise<Partial<Category>> {
    return await this.categoryService.updateCategories(updateCategoryInput, user.userId)
  }
}
