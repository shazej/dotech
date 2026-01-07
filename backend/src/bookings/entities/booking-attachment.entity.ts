import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

export enum AttachmentType {
    PHOTO = 'photo',
    VIDEO = 'video',
}

@Entity('booking_attachments')
export class BookingAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @ManyToOne(() => Booking, (booking) => booking.attachments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column()
    url: string;

    @Column({
        type: 'simple-enum',
        enum: AttachmentType,
        default: AttachmentType.PHOTO,
    })
    type: AttachmentType;

    @CreateDateColumn()
    createdAt: Date;
}
