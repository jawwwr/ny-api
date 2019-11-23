import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length } from 'class-validator';
import { User } from '../user/User';

@Entity()
export class RestaurantRank {
    @Unique(['restaurantId', 'userId'])
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.restaurantRanks)
    user: User;

    @Column()
    restaurantId: string;

    @Column()
    points: number;

    @Column()
    current_rank: number;

    @Column()
    isActive: boolean;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;


}