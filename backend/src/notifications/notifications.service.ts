import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { NotificationsGateway } from './notifications.gateway';
import { DeviceToken, DevicePlatform } from './entities/device-token.entity';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly gateway: NotificationsGateway,
        @InjectRepository(DeviceToken)
        private readonly deviceTokensRepository: Repository<DeviceToken>,
    ) { }

    async registerToken(userId: string, token: string, platform: DevicePlatform) {
        // Check if token already exists
        let deviceToken = await this.deviceTokensRepository.findOne({ where: { token } });

        if (deviceToken) {
            // Update userId and last activity
            deviceToken.userId = userId;
            deviceToken.platform = platform;
            await this.deviceTokensRepository.save(deviceToken);
        } else {
            // Create new token
            deviceToken = this.deviceTokensRepository.create({
                userId,
                token,
                platform,
            });
            await this.deviceTokensRepository.save(deviceToken);
        }
    }

    async notifyUser(userId: string, title: string, body: string, data?: Record<string, string>) {
        console.log(`Sending notification to ${userId}: ${title} - ${body}`);

        // 1. Send via WebSocket (for in-app real-time updates)
        this.gateway.sendNotification(`user_${userId}`, {
            title,
            body,
            data,
            timestamp: new Date().toISOString(),
        });

        // 2. Send via FCM (for push notifications)
        await this.sendFcmNotification(userId, title, body, data);
    }

    private async sendFcmNotification(userId: string, title: string, body: string, data?: Record<string, string>) {
        // Get all device tokens for the user
        const tokens = await this.deviceTokensRepository.find({ where: { userId } });

        if (!tokens.length) return;

        const fcmTokens = tokens.map(t => t.token);

        try {
            const message: admin.messaging.MulticastMessage = {
                tokens: fcmTokens,
                notification: {
                    title,
                    body,
                },
                data: data || {},
                // Android specific config
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                    }
                },
                // iOS specific config
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            contentAvailable: true,
                        }
                    }
                }
            };

            const response = await admin.messaging().sendEachForMulticast(message);

            // Clean up invalid tokens
            if (response.failureCount > 0) {
                const invalidTokens: string[] = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        const error = resp.error;
                        if (error && (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered')) {
                            invalidTokens.push(fcmTokens[idx]);
                        }
                    }
                });

                if (invalidTokens.length > 0) {
                    await this.deviceTokensRepository.delete(invalidTokens.map(token => ({ token })));
                }
            }

        } catch (error) {
            console.error('Error sending FCM notification:', error);
        }
    }
}
