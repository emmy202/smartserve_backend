import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryType } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() data: { name: string; type: CategoryType }) {
    return this.categoriesService.create(data);
  }

  @Get()
  findAll(@Query('type') type?: CategoryType) {
    return this.categoriesService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: { name: string; type?: CategoryType }) {
    return this.categoriesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
