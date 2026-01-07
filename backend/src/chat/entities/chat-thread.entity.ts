import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ChatMessage } from './chat-message.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('chat_threads')
export class ChatThread {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @OneToOne(() => Booking)
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @OneToMany(() => ChatMessage, (message) => message.thread)
    messages: ChatMessage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
