import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    iconUrl: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => Service, (service) => service.category)
    services: Service[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
