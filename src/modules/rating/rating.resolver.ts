import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'

import { Allow, CurrentUser, JwtUserPayload } from '@app/common'

import { CreateRatingInput, ListRatingsInput } from './dto/inputs'
import { ListRatingsResponse } from './dto/args'
import { Rating } from './entities'
import { RatingService } from './rating.service'

@Resolver(() => Rating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  // Queries

  @Query(() => ListRatingsResponse, {
    description: 'The List of ratings with Pagination and filters'
  })
  async getRatings(
    @Args('input') listRatingsInput: ListRatingsInput
  ): Promise<ListRatingsResponse> {
    const [ratings, count, limit, offset] =
      await this.ratingService.getRatingsWithPagination(listRatingsInput)
    return { results: ratings, totalRows: count, limit, offset }
  }

  // Mutations

  @Mutation(() => Rating, {
    description: 'This will give new rating to the customer'
  })
  @Allow()
  async giveRatingToOrganizer(
    @Args('input') createRatingInput: CreateRatingInput,
    @CurrentUser() user: JwtUserPayload
  ): Promise<Rating> {
    return await this.ratingService.giveRatingToOrganizer(createRatingInput, user)
  }
}
