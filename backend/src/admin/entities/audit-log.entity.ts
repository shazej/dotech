import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    userId: string; // User who performed the action

    @Column()
    action: string; // e.g. "Create User", "Delete Booking"

    @Column({ type: 'simple-json', nullable: true })
    details: any;

    @Column({ nullable: true })
    ipAddress: string;

    @CreateDateColumn()
    createdAt: Date;
}
