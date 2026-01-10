import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Request() req: any, @Body() createServiceDto: any) {
        return this.servicesService.create(req.user.id, createServiceDto);
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
