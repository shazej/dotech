import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Category } from './entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Service, Category])],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class ServicesModule { }
