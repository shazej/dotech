import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { ProviderProfile } from './entities/provider-profile.entity';
import { CustomerAddress } from './entities/customer-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CustomerProfile, ProviderProfile, CustomerAddress])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
