import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DevicePlatform {
    IOS = 'ios',
    ANDROID = 'android',
    WEB = 'web',
}

@Entity('device_tokens')
export class DeviceToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ unique: true })
    token: string;

    @Column({
        type: 'simple-enum',
        enum: DevicePlatform,
    })
    platform: DevicePlatform;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
