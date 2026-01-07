import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    paymentId: string;

    @OneToOne(() => Payment, (payment) => payment.invoice, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'paymentId' })
    payment: Payment;

    @Column()
    invoiceNumber: string;

    @Column({ nullable: true })
    url: string; // PDF URL

    @CreateDateColumn()
    createdAt: Date;
}
