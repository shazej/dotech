import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    create(@Body() createServiceDto: any) {
        // In real app, providerId comes from Auth User
        return this.servicesService.create(createServiceDto);
    }

    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @Get('provider/:providerId')
    findByProvider(@Param('providerId') providerId: string) {
        return this.servicesService.findByProvider(providerId);
    }
}
