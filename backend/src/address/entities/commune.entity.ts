import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { District } from "./district.entity"
import { Village } from "./village.entity"

@Entity("communes")
export class Commune {
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

    @ManyToOne(() => District, district => district.communes)
    district: District

    @OneToMany(() => Village, village => village.commune)
    villages: Village[]
}
