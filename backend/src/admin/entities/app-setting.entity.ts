import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('app_settings')
export class AppSetting {
    @PrimaryColumn()
    key: string;

    @Column()
    value: string;

    @Column({ nullable: true })
    description: string;
}
