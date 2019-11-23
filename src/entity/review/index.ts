import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length } from 'class-validator';
import { User } from '../user';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.reviews)
    user: User;

    @Column()
    restaurantId: string;

    @Column()
    remarks: string;

    @Column()
    starRating: number;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

}