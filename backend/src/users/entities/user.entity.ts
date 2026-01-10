import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';
import { ProviderProfile } from './provider-profile.entity';
import { CustomerAddress } from './customer-address.entity';

export enum UserRole {
    CUSTOMER = 'customer',
    PROVIDER = 'provider',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true, unique: true })
    firebaseUid?: string;

    @Column({ nullable: true, unique: true })
    email?: string;

    @Column({ nullable: true, select: false })
    password?: string;

    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    lastOtp?: string;

    @Column({ type: 'timestamp', nullable: true })
    otpExpiry?: Date;

    @OneToOne(() => CustomerProfile, (profile) => profile.user, { cascade: true })
    customerProfile!: CustomerProfile;

    @OneToOne(() => ProviderProfile, (profile) => profile.user, { cascade: true })
    providerProfile!: ProviderProfile;

    @OneToMany(() => CustomerAddress, (address) => address.user, { cascade: true })
    addresses!: CustomerAddress[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
