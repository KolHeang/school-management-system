import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { District } from "./district.entity";

@Entity("provinces")
export class Province {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", select: true })
    type: string

    @Column({ type: "int", select: false })
    code: number

    @Column({ type: "varchar" })
    name_km: string;

    @Column({ type: "varchar" })
    name_en: string;

    @OneToMany(() => District, district => district.province)
    districts: District[]
}
