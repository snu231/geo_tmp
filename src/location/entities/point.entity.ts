import { Geometry, Point  } from "geojson";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GeometryTransformer } from "./geotransformer";

@Entity()
export class Poi {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "geometry",
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
        transformer: new GeometryTransformer(),

    })
    point: Point;

}
