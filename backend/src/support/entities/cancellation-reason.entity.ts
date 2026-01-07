import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cancellation_reasons')
export class CancellationReason {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    reason: string;

    @Column()
    type: string; // 'customer' or 'provider'

    @Column({ default: true })
    isActive: boolean;
}
