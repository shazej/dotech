import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async sendOtp(phone: string): Promise<string> {
        let user = await this.usersService.findOneByPhone(phone);
        if (!user) {
            user = await this.usersService.create(phone, UserRole.CUSTOMER);
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 5);

        await this.usersService.updateOtp(user.id, otp, expiry);

        // In production, send this via SMS gateway
        console.log(`[AUTH] OTP for ${phone}: ${otp}`);
        return otp;
    }

    async verifyOtp(phone: string, otp: string): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOneByPhone(phone);
        if (!user || user.lastOtp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        // Clear OTP and mark verified after successful verification
        await this.usersService.markVerified(user.id);
        await this.usersService.updateOtp(user.id, null, null);

        return this.login(user);
    }

    async login(user: User) {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: user.id, phone: user.phone, role: user.role, isVerified: user.isVerified },
        };
    }

    async loginAdmin(email: string) {
        // Mock Admin Payload
        const payload = { sub: 'admin-uuid', email, role: 'admin' };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: 'admin-uuid', email, role: 'admin' },
        };
    }

    async register(email: string, password: string, phone: string, role: UserRole) {
        const existingInfo = await this.usersService.findOneByPhone(phone);
        if (existingInfo) throw new ConflictException('Phone already exists');

        const existingEmail = await this.usersService.findOneByEmail(email);
        if (existingEmail) throw new ConflictException('Email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.createWithPassword(email, hashedPassword, phone, role);

        if (role === UserRole.PROVIDER) {
            await this.usersService.createProviderProfile(user.id, `Business of ${email.split('@')[0]}`);
        }

        return this.login(user);
    }

    async loginWithPassword(email: string, pass: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        return this.login(user);
    }
}
