import {ObjectId} from "mongoose";

export interface MenuEntity {
    _id?: ObjectId;
    name: string;
}