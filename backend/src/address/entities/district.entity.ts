import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Commune } from "./commune.entity";
import { Province } from "./province.entity";

@Entity("districts")
export class District {
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

    @ManyToOne(() => Province, province => province.districts)
    province: Province

    @OneToMany(() => Commune, commune => commune.district)
    communes: Commune[]
}
