import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class PointBreakdown {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    point: number;
}
