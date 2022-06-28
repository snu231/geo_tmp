import { Geometry, Point, Polygon  } from "geojson";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GeometryTransformer } from "./geotransformer";

@Entity()
export class Poly {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "geometry",
        spatialFeatureType: 'Polygon',
        srid: 4326,
        nullable: true,
        transformer: new GeometryTransformer(),

    })
    polygon: Polygon;

}
