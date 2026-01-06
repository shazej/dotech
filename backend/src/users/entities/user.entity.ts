import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
    email?: string;

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

    @Column({ type: 'datetime', nullable: true })
    otpExpiry?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
