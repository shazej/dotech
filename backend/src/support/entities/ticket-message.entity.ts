import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { SupportTicket } from './support-ticket.entity';

@Entity('ticket_messages')
export class TicketMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ticketId: string;

    @ManyToOne(() => SupportTicket, (ticket) => ticket.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ticketId' })
    ticket: SupportTicket;

    @Column()
    senderId: string; // User ID or Admin ID

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
