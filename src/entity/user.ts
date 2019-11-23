import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import {RestaurantRank} from "./RestaurantRank";
import {CheckIn} from "./CheckIn";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 80
    })
    @Length(10, 80)
    name: string;

    @Column({
        length: 100
    })
    @Length(10, 100)
    @IsEmail()
    email: string;

    @Column()
    profilePicture: string;

    @Column("datetime")
    lastCheckInTime: number;

    @OneToMany(type => RestaurantRank, restaurantRank => restaurantRank.user)
    restaurantRanks: RestaurantRank[];

    @OneToMany(type => CheckIn, checkIn => checkIn.user)
    checkIns: CheckIn[];

    @Column()
    isActive: boolean;

}

export const userSchema = {
    id: { type: 'number', required: true, example: 1 },
    name: { type: 'string', required: true, example: 'Javier' },
    email: { type: 'string', required: true, example: 'avileslopez.javier@gmail.com' },
    profilePicture: { type: 'string', required: true, example: 'https://ih1.redbubble.net/image.686871229.3288/flat,800x800,070,f.u1.jpg' }

};