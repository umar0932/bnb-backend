import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AdminModule } from '@app/admin'
import { Event } from '@app/events/entities'

import { Category, SubCategory } from './entities'
import { CategoryResolver } from './category.resolver'
import { CategoryService } from './category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory, Event]), AdminModule],
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
