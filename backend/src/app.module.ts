import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProvidersModule } from './providers/providers.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const useSqlite = true; // Switched to SQLite as per user confirmation due to missing Docker

        if (useSqlite) {
          console.log('Using SQLite Database (Mode: Fallback/Local)');
          return {
            type: 'sqlite',
            database: 'dotech.sqlite',
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port: parseInt(configService.get<string>('DB_PORT') || '5432'),
          username: configService.get<string>('DB_USER') || 'postgres',
          password: configService.get<string>('DB_PASSWORD') || 'postgres',
          database: configService.get<string>('DB_NAME') || 'dotech',
          autoLoadEntities: true,
          synchronize: true, // Only for development!
        };
      },
    }),
    AuthModule,
    UsersModule,
    PaymentsModule,
    NotificationsModule,
    ProvidersModule,
    ServicesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
