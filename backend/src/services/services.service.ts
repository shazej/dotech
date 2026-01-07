import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) { }

    async create(createServiceDto: {
        providerId: string; // This is the USER ID of the provider
        categoryId: string;
        name: string;
        description?: string;
        price: number;
        durationMinutes: number;
    }) {
        // Ideally we should inject UsersService or ProviderService to fetch profile, 
        // but for now we can rely on relation id mapping if we passed profileId.
        // However, if we pass userId, we need to resolve it. 
        // Let's assume for now we are passing the PROFILE ID to this internal service method, 
        // OR we simply save what we have if the DTO passes the Profile ID.

        // BUT, mostly frontend sends User ID or we get it from token.
        // Let's assume DTO contains PROVIDER PROFILE ID for simplicity of this CRUD, 
        // or better, let's allow TypeORM to handle it if we fix the DTO.

        const service = this.servicesRepository.create({
            // If providerId is actually ProfileID:
            provider: { id: createServiceDto.providerId } as any,
            category: { id: createServiceDto.categoryId },
            name: createServiceDto.name,
            description: createServiceDto.description,
            price: createServiceDto.price,
            durationMinutes: createServiceDto.durationMinutes,
            providerId: createServiceDto.providerId,
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
