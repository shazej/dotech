import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    @UseGuards(JwtAuthGuard)
    createPaymentIntent(@Body() body: { amount: number; currency: string }) {
        return this.paymentsService.createPaymentIntent(body.amount, body.currency);
    }

    @Post('webhook')
    handleWebhook(@Body() body: any) {
        return this.paymentsService.handleWebhook(body);
    }
}
