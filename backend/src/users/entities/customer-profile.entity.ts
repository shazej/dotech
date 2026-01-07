import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('customer_profiles')
export class CustomerProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @OneToOne(() => User, (user) => user.customerProfile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    userId: string; // Foreign key explicit column

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
