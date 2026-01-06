import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Provider } from '../../providers/entities/provider.entity';

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

    @ManyToOne(() => Provider)
    @JoinColumn({ name: 'providerId' })
    provider: Provider;

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
