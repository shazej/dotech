import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

@Entity('promo_codes')
export class PromoCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column({
        type: 'simple-enum',
        enum: DiscountType,
        default: DiscountType.FIXED,
    })
    discountType: DiscountType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ type: 'timestamp', nullable: true })
    expiryDate: Date;

    @Column({ default: 0 })
    usageLimit: number; // 0 = unlimited

    @Column({ default: 0 })
    usageCount: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
