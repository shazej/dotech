import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { ProviderProfile } from './entities/provider-profile.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(ProviderProfile)
        private providerProfilesRepository: Repository<ProviderProfile>,
    ) { }

    findOneByPhone(phone: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ phone });
    }

    async create(phone: string, role: UserRole = UserRole.CUSTOMER): Promise<User> {
        const user = this.usersRepository.create({ phone, role });
        return this.usersRepository.save(user);
    }

    findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role', 'phone', 'isVerified']
        });
    }

    async createWithPassword(email: string, password: string, phone: string, role: UserRole): Promise<User> {
        const user = this.usersRepository.create({ email, password, phone, role, isVerified: true });
        return this.usersRepository.save(user);
    }

    async updateOtp(userId: string, otp: string | null, expiry: Date | null): Promise<void> {
        await this.usersRepository.update(userId, {
            lastOtp: otp as any,
            otpExpiry: expiry as any,
        });
    }

    async createProviderProfile(userId: string, businessName: string): Promise<ProviderProfile> {
        const profile = this.providerProfilesRepository.create({
            userId,
            businessName,
            isVerified: true, // Auto verify for dev
            rating: 5.0,
        });
        return this.providerProfilesRepository.save(profile);
    }

    async markVerified(userId: string): Promise<void> {
        await this.usersRepository.update(userId, { isVerified: true });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async findProviderProfile(userId: string): Promise<ProviderProfile | null> {
        return this.providerProfilesRepository.findOneBy({ userId });
    }
    async findOneByFirebaseUid(firebaseUid: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { firebaseUid } });
    }

    async createWithFirebase(firebaseUid: string, email: string | null, phone: string | null, role: UserRole): Promise<User> {
        const user = this.usersRepository.create({
            firebaseUid,
            email: email ?? undefined,
            phone: phone ?? undefined,
            role,
            isVerified: true,
        });
        return this.usersRepository.save(user);
    }
}

