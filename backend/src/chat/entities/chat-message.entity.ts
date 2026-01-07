import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ChatThread } from './chat-thread.entity';

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    threadId: string;

    @ManyToOne(() => ChatThread, (thread) => thread.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'threadId' })
    thread: ChatThread;

    @Column()
    senderId: string; // User ID

    @Column({ type: 'text' })
    content: string;

    @Column({ nullable: true })
    attachmentUrl: string; // Optional image/file

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
