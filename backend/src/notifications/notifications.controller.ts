import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { DevicePlatform } from './entities/device-token.entity';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post('token')
    async registerToken(
        @Request() req: any,
        @Body('deviceToken') deviceToken: string,
        @Body('platform') platform: DevicePlatform,
    ) {
        await this.notificationsService.registerToken(req.user.userId, deviceToken, platform);
        return { success: true };
    }
}
