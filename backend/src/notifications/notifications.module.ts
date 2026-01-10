import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [TypeOrmModule.forFeature([DeviceToken])],
    controllers: [NotificationsController],
    providers: [NotificationsGateway, NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
