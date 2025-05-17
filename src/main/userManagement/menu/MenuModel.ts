import {ObjectId} from "mongoose";

export default interface MenuModel {
    _id?: ObjectId;
    name: string;
}