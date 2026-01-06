import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    constructor(private readonly gateway: NotificationsGateway) { }

    async notifyUser(userId: string, title: string, body: string) {
        // In a real app, we would also send FCM push notification here
        console.log(`Sending notification to ${userId}: ${title} - ${body}`);

        // Send via WebSocket
        this.gateway.sendNotification(`user_${userId}`, {
            title,
            body,
            timestamp: new Date().toISOString(),
        });
    }
}
