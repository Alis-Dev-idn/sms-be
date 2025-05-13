import {ObjectId} from "mongoose";
import {RoleEntity} from "../role/RoleEntity";

export interface UserEntity {
    _id?: ObjectId;
    fullName: string;
    userName: string;
    password: string;
    roleId: ObjectId | RoleEntity;
    branchId?: ObjectId;
    createdBy?: ObjectId | UserEntity;
}