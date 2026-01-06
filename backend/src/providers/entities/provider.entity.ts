import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProviderStatus {
    UNVERIFIED = 'unverified',
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

@Entity('providers')
export class Provider {
    @PrimaryColumn('uuid')
    userId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({
        type: 'simple-enum',
        enum: ProviderStatus,
        default: ProviderStatus.UNVERIFIED,
    })
    verifiedStatus: ProviderStatus;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    longitude: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
    commissionRate: number; // e.g. 15.00 for 15%

    @OneToMany(() => AvailabilitySlot, (slot) => slot.provider)
    availabilitySlots: AvailabilitySlot[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('availability_slots')
export class AvailabilitySlot {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    providerId: string;

    @ManyToOne(() => Provider, (provider) => provider.availabilitySlots)
    @JoinColumn({ name: 'providerId' })
    provider: Provider;

    @Column()
    dayOfWeek: number; // 0-6

    @Column()
    startTime: string; // "09:00"

    @Column()
    endTime: string; // "17:00"
}
