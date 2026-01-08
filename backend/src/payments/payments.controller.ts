import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('intent')
    async createPaymentIntent(@Body('bookingId') bookingId: string) {
        return this.paymentsService.createPaymentIntent(bookingId);
    }

    @Post(':id/confirm')
    async confirmPayment(@Param('id') id: string) {
        return this.paymentsService.confirmPayment(id);
    }
}
