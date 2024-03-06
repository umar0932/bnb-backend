import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload } from '@app/common'

import { Category, SubCategory } from './entities'
import { CategoryService } from './category.service'
import {
  CreateCategoryInput,
  CreateSubCategoryInput,
  ListCategoriesInput,
  ListSubCategoriesInput,
  UpdateCategoryInput,
  UpdateSubCategoryInput
} from './dto/inputs'
import { ListCategoriesResponse, ListSubCategoriesResponse } from './dto/args'

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // Queries

  @Query(() => ListCategoriesResponse, {
    description: 'The List of categories with Pagination and filters'
  })
  @Allow()
  async getCategories(
    @Args('input') listCategoriesInput: ListCategoriesInput
  ): Promise<ListCategoriesResponse> {
    const [categories, count, limit, offset] =
      await this.categoryService.getCategoriesWithPagination(listCategoriesInput)
    return { results: categories, totalRows: count, limit, offset }
  }

  @Query(() => ListSubCategoriesResponse, {
    description: 'The List of sub categories with Pagination and filters'
  })
  @Allow()
  async getSubCategories(
    @Args('input') listSubCategoriesInput: ListSubCategoriesInput
  ): Promise<ListSubCategoriesResponse> {
    const [subCategories, count, limit, offset] =
      await this.categoryService.getSubCategoriesWithPagination(listSubCategoriesInput)
    return { results: subCategories, totalRows: count, limit, offset }
  }

  @Query(() => [Category], { description: 'This will get all categories' })
  @Allow()
  getAllCategories(@CurrentUser() user: JwtUserPayload): Promise<Category[]> {
    return this.categoryService.getAllCategories(user.userId)
  }

  @Query(() => [SubCategory], { description: 'This will get all categories' })
  @Allow()
  getAllSubCategories(@CurrentUser() user: JwtUserPayload): Promise<SubCategory[]> {
    return this.categoryService.getAllSubCategories(user.userId)
  }

  // Mutations

  @Mutation(() => Category, {
    description: 'This will create new Categories'
  })
  @Allow()
  async createCategory(
    @Args('input') createCategoryData: CreateCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Category> {
    return await this.categoryService.createCategory(createCategoryData, user.userId)
  }

  @Mutation(() => Category, { description: 'This will update Category' })
  @Allow()
  async updateCategory(
    @Args('input') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Partial<Category>> {
    return await this.categoryService.updateCategories(updateCategoryInput, user.userId)
  }

  @Mutation(() => SubCategory, {
    description: 'This will create new SubCategories'
  })
  @Allow()
  async createSubCategory(
    @Args('input') createSubCategoryInput: CreateSubCategoryInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<SubCategory> {
    return await this.categoryService.createSubCategory(createSubCategoryInput, user.userId)
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
