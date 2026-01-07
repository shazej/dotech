import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Invoice } from './invoice.entity';
import { Refund } from './refund.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    HELD = 'held', // Escrow
    RELEASED = 'released',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @OneToOne(() => Booking)
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    transactionId: string; // Stripe Payment Intent ID

    @Column({
        type: 'simple-enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @OneToOne(() => Invoice, (invoice) => invoice.payment, { cascade: true })
    invoice: Invoice;

    @OneToMany(() => Refund, (refund) => refund.payment, { cascade: true })
    refunds: Refund[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
