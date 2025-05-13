import {ObjectId} from "mongoose";
import {MenuEntity} from "../menu/MenuEntity";

export type RolePermission = "read" | "write" | "delete" | "update";
export interface RoleEntity {
    _id?: ObjectId;
    name: string;
    menuId?: ObjectId[] | MenuEntity[];
    permissions: RolePermission[];
}