import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Category } from './entities/category.entity';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
    imports: [TypeOrmModule.forFeature([Service, Category])],
    controllers: [CategoriesController, ServicesController],
    providers: [CategoriesService, ServicesService],
    exports: [TypeOrmModule, CategoriesService, ServicesService],
})
export class ServicesModule { }
