import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { RestaurantRank } from '../restaurant_rank';
import { Review } from '../review';
import { CheckIn } from '../check_in';

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

    @Column('datetime')
    lastCheckInTime: number;

    @OneToMany(type => RestaurantRank, restaurantRank => restaurantRank.user)
    restaurantRanks: RestaurantRank[];

    @OneToMany(type => Review, review => review.user)
    reviews: RestaurantRank[];

    @OneToMany(type => CheckIn, checkIn => checkIn.user)
    checkIns: CheckIn[];

    @Column()
    isActive: boolean;

}