import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PromoCode } from './promo-code.entity';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('promo_redemptions')
export class PromoRedemption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    promoCodeId: string;

    @ManyToOne(() => PromoCode)
    @JoinColumn({ name: 'promoCodeId' })
    promoCode: PromoCode;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    bookingId: string;

    @ManyToOne(() => Booking)
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @CreateDateColumn()
    createdAt: Date;
}
