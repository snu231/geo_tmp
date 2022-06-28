import {  Point  } from "geojson";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GeometryTransformer } from "./geotransformer";

@Entity()
export class TmpPoint {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    floor: number;

    @Column({
        type: "geometry",
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
        transformer: new GeometryTransformer(),

    })
    point: Point;

    @CreateDateColumn()
    createdAt: Date;
}
