import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Commune } from "./commune.entity"

@Entity("villages")
export class Village {
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

    @ManyToOne(() => Commune, commune => commune.villages, { nullable: true })
    commune: Commune;
}
