import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
        private usersService: UsersService,
    ) { }

    async create(userId: string, createServiceDto: {
        categoryId: string;
        name: string;
        description?: string;
        price: number;
        durationMinutes: number;
    }) {
        const providerProfile = await this.usersService.findProviderProfile(userId);
        if (!providerProfile) {
            throw new NotFoundException('Provider profile not found for user');
        }

        const service = this.servicesRepository.create({
            provider: { id: providerProfile.id } as any,
            category: { id: createServiceDto.categoryId },
            name: createServiceDto.name,
            description: createServiceDto.description,
            price: createServiceDto.price,
            durationMinutes: createServiceDto.durationMinutes,
            providerId: providerProfile.id,
            categoryId: createServiceDto.categoryId,
        });
        return this.servicesRepository.save(service);
    }

    async findAll() {
        return this.servicesRepository.find({
            relations: ['provider', 'category'],
        });
    }

    async findByProvider(providerId: string) {
        return this.servicesRepository.find({
            where: { providerId },
            relations: ['category'],
        });
    }
}
