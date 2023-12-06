import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Admin } from '@app/admin/entities'
import { AdminModule } from '@app/admin'

import { Category, SubCategory } from './entities'
import { CategoryResolver } from './category.resolver'
import { CategoryService } from './category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory]), AdminModule],
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
