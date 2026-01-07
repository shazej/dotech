import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProviderProfile } from '../../users/entities/provider-profile.entity';
import { BookingAttachment } from './booking-attachment.entity';
import { BookingExtraCharge } from './booking-extra-charge.entity';

export enum BookingStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    ARRIVED = 'arrived',
    STARTED = 'started',
    COMPLETED = 'completed',
    CANCELLED_BY_CUSTOMER = 'cancelled_by_customer',
    CANCELLED_BY_PROVIDER = 'cancelled_by_provider',
    REJECTED = 'rejected',
    TIMEOUT = 'timeout',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    customerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'customerId' })
    customer: User;

    @Column()
    providerId: string;

    @ManyToOne(() => ProviderProfile)
    @JoinColumn({ name: 'providerId' })
    provider: ProviderProfile;

    @Column({ type: 'simple-json' })
    serviceSnapshot: {
        serviceId: string;
        name: string;
        price: number;
        durationMinutes: number;
    };

    @Column({
        type: 'simple-enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Column({ type: 'datetime' })
    scheduledAt: Date;

    @Column({ type: 'datetime', nullable: true })
    completedAt: Date;

    @OneToMany(() => BookingAttachment, (attachment) => attachment.booking, { cascade: true })
    attachments: BookingAttachment[];

    @OneToMany(() => BookingExtraCharge, (charge) => charge.booking, { cascade: true })
    extraCharges: BookingExtraCharge[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
