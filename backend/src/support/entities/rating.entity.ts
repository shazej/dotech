import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('ratings')
export class Rating {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @OneToOne(() => Booking)
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column()
    reviewerId: string; // User who wrote the review

    @Column()
    revieweeId: string; // User being reviewed

    @Column({ type: 'int' })
    rating: number; // 1-5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn()
    createdAt: Date;
}
