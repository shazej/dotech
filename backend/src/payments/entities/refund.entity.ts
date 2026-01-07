import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('refunds')
export class Refund {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    paymentId: string;

    @ManyToOne(() => Payment, (payment) => payment.refunds)
    @JoinColumn({ name: 'paymentId' })
    payment: Payment;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    reason: string;

    @Column({ default: 'pending' }) // pending, completed, failed
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
