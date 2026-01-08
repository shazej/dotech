import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private dataSource: DataSource,
    ) { }

    async createPaymentIntent(bookingId: string) {
        const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });
        if (!booking) throw new NotFoundException('Booking not found');

        // Check if payment already exists
        const existing = await this.paymentsRepository.findOne({ where: { bookingId } });
        if (existing) return { paymentId: existing.id, clientSecret: existing.transactionId, status: existing.status };

        // Mock Stripe Intent
        const amount = booking.serviceSnapshot.price;
        const transactionId = `pi_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const payment = this.paymentsRepository.create({
            bookingId,
            amount,
            transactionId,
            status: PaymentStatus.PENDING,
        });

        await this.paymentsRepository.save(payment);

        return {
            paymentId: payment.id,
            clientSecret: transactionId,
            amount,
            status: PaymentStatus.PENDING,
        };
    }

    async confirmPayment(paymentId: string) {
        return this.dataSource.transaction(async (manager) => {
            const payment = await manager.findOne(Payment, { where: { id: paymentId } });
            if (!payment) throw new NotFoundException('Payment not found');

            if (payment.status === PaymentStatus.HELD || payment.status === PaymentStatus.RELEASED) {
                return payment;
            }

            // Update Status
            payment.status = PaymentStatus.HELD; // Held in Escrow usually
            await manager.save(payment);

            // Generate Invoice
            const invoice = manager.create(Invoice, {
                payment,
                invoiceNumber: `INV-${Date.now()}`,
                amount: payment.amount,
                issuedAt: new Date(),
                status: 'paid', // simple string for now, arguably enum
            });
            await manager.save(invoice);

            return { payment, invoice };
        });
    }
}
