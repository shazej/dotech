import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('notification_templates')
export class NotificationTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    type: string; // e.g. "BOOKING_ACCEPTED"

    @Column()
    titleTemplate: string;

    @Column({ type: 'text' })
    bodyTemplate: string;

    @Column({ default: true })
    isActive: boolean;

    @UpdateDateColumn()
    updatedAt: Date;
}
