import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('provider_location_logs')
export class ProviderLocationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    providerId: string; // Linked to Provider/User ID

    @Column({ type: 'double precision' })
    latitude: number;

    @Column({ type: 'double precision' })
    longitude: number;

    @CreateDateColumn()
    timestamp: Date;
}
