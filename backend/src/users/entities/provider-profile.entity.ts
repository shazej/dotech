import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('provider_profiles')
export class ProviderProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    businessName: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ default: 0 })
    reviewCount: number;

    @Column({ default: false })
    isOnline: boolean;

    @Column({ default: false })
    isVerified: boolean;

    // Location for basic search (can be PostGIS later if needed, but keeping simple for now)
    @Column({ type: 'float', nullable: true })
    latitude: number;

    @Column({ type: 'float', nullable: true })
    longitude: number;

    @OneToOne(() => User, (user) => user.providerProfile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
