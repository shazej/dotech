import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider, AvailabilitySlot } from './entities/provider.entity';
// import { ProvidersService } from './providers.service';
// import { ProvidersController } from './providers.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Provider, AvailabilitySlot])],
    controllers: [], // ProvidersController
    providers: [], // ProvidersService
    exports: [TypeOrmModule],
})
export class ProvidersModule { }
