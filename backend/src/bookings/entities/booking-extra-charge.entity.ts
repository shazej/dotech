import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('booking_extra_charges')
export class BookingExtraCharge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @ManyToOne(() => Booking, (booking) => booking.extraCharges, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ default: false })
    isApproved: boolean; // Customer must approve extra charges

    @CreateDateColumn()
    createdAt: Date;
}
