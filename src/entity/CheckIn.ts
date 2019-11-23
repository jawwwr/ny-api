import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Double } from 'typeorm';
import { Length } from 'class-validator';
import {User} from "./User";

@Entity()
export class CheckIn {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.checkIns)
    user: User;

    @Column()
    restaurantId: string;

    @Column()
    points: number;

    @Column({type: "timestamp"})
    time: Date;

    @Column({type: "double"})
    latitude: Double;

    @Column({type: "double"})
    longitude: Double;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;


}