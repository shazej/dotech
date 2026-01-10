import { Controller, Post, Get, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('otp/send')
    async sendOtp(@Body('phone') phone: string) {
        const otp = await this.authService.sendOtp(phone);
        return { message: 'OTP sent successfully', otp: process.env.NODE_ENV === 'development' ? otp : undefined };
    }

    @Post('otp/verify')
    async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
        return this.authService.verifyOtp(phone, otp);
    }

    @Post('register')
    async register(@Body() body: any) {
        return this.authService.register(body.email, body.password, body.phone, body.role || UserRole.CUSTOMER);
    }

    @Post('login')
    async login(@Body() body: any) {
        return this.authService.loginWithPassword(body.email, body.password);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe(@Request() req: any) {
        // Map to frontend expected format if needed, or just return what we have
        // Frontend expects id, email, role. JwtStrategy returns userId, phone, role.
        // We might need to fetch the full user if we want email/profile.
        // For now, let's return the basic info and handle frontend mapping.
        return {
            id: req.user.userId,
            phone: req.user.phone,
            role: req.user.role,
        };
    }
}
