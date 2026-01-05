import { Injectable, UnauthorizedException } from '@nestjs/common';
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

        // Clear OTP after successful verification
        await this.usersService.updateOtp(user.id, null, null);

        return this.login(user);
    }

    async login(user: User) {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
