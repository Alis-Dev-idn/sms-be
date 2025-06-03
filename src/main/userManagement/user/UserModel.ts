import {ObjectId} from "mongoose";
import RoleModel from "../role/RoleModel";

export default interface UserModel {
    _id?: ObjectId;
    fullName: string;
    userName: string;
    password: string;
    roleId: ObjectId | RoleModel;
    branchId?: ObjectId;
    createdBy?: ObjectId | UserModel;
    createdAt?: Date;
    updatedAt?: Date;
}