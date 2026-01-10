import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRole } from '../users/entities/user.entity';
import { FirebaseAuthService } from './firebase-auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly firebaseAuthService: FirebaseAuthService,
    ) { }

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

    @Post('firebase')
    async firebase(@Body('idToken') idToken: string) {
        return this.firebaseAuthService.verifyFirebaseToken(idToken);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe(@Request() req: any) {
        return {
            id: req.user.userId,
            phone: req.user.phone,
            role: req.user.role,
        };
    }
}



