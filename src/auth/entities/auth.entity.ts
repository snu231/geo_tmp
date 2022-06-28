import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userid: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt : Date;

    @Column({
        nullable:true
    })
    imageFileURL: string;

}
