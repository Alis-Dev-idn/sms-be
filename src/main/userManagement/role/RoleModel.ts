import {ObjectId} from "mongoose";
import MenuModel from "../menu/MenuModel";

export enum RolePermission {
    READ = "read",
    WRITE = "write",
    DELETE = "delete",
    UPDATE = "update"
}

export const RolePermissionList: string[] = [
    RolePermission.READ,
    RolePermission.WRITE,
    RolePermission.DELETE,
    RolePermission.UPDATE
]

export const HasPermission = (permission: string[]): boolean => {
    return permission.every(permission => RolePermissionList.includes(permission));
}

export default interface RoleModel {
    _id?: ObjectId;
    name: string;
    menuId?: ObjectId[] | MenuModel[];
    permissions: RolePermission[];
}