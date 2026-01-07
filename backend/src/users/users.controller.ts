import { Controller, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post(':id/provider-profile')
    async createProviderProfile(@Param('id') id: string, @Body('businessName') businessName: string) {
        return this.usersService.createProviderProfile(id, businessName);
    }
}
