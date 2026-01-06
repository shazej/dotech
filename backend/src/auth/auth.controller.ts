import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

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

    @Post('login')
    async login(@Body() body: any) {
        // Simple Admin Mock Auth check in controller, then generic sign in service
        if (body.email === 'admin@dotech.com' && body.password === 'admin123') {
            return this.authService.loginAdmin(body.email);
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}
