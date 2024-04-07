import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Urltemp{
    @PrimaryGeneratedColumn('uuid')
    id:string
     
    @Column()
    urloriginal:string

    @Column()
    urlcorta:string

    @Column({default: 0})
    click:number

    @Column('timestamp')
    expirationDate: Date;

    @CreateDateColumn()
    creationDate: Date;
}