import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: { name: string; iconUrl?: string; parentId?: string }) {
        let parent: Category | null = null;
        if (createCategoryDto.parentId) {
            parent = await this.categoriesRepository.findOneBy({ id: createCategoryDto.parentId });
        }

        const category = this.categoriesRepository.create({
            name: createCategoryDto.name,
            iconUrl: createCategoryDto.iconUrl,
            parent: parent || undefined,
        });

        return this.categoriesRepository.save(category);
    }

    async findAll() {
        return this.categoriesRepository.find({
            relations: ['children', 'parent'],
            where: { parent: { id: null as any } }, // Return root categories with children
        });
    }

    async findOne(id: string) {
        return this.categoriesRepository.findOne({
            where: { id },
            relations: ['children'],
        });
    }
}
