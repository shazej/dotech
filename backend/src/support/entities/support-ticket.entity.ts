import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TicketMessage } from './ticket-message.entity';

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

@Entity('support_tickets')
export class SupportTicket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    subject: string;

    @Column({
        type: 'simple-enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @Column({ default: 'medium' })
    priority: string;

    @OneToMany(() => TicketMessage, (message) => message.ticket, { cascade: true })
    messages: TicketMessage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
