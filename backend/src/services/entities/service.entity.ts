import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProviderProfile } from '../../users/entities/provider-profile.entity';
import { Category } from './category.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    providerId: string;

    @ManyToOne(() => ProviderProfile)
    @JoinColumn({ name: 'providerId' })
    provider: ProviderProfile;

    @Column()
    categoryId: string;

    @ManyToOne(() => Category, (category) => category.services)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int' })
    durationMinutes: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
