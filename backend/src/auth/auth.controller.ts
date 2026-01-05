import { Controller, Post, Body } from '@nestjs/common';
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
}
