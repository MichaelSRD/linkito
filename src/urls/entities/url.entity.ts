import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Url {

    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column({ unique: true })
    url_original:string

    @Column({ unique: true })
    url_corta:string
    
    @Column({default: 0 })
    clicks:number

    @Column({default:false})
    temporal:boolean

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(()=> User)
    @JoinColumn({ name: 'useremail', referencedColumnName:'email' })
    user:User

    @Column({nullable:true, default:'usuario anónimo'})
    useremail:string
}
