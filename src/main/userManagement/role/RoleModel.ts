import {ObjectId} from "mongoose";
import MenuModel from "../menu/MenuModel";

export enum RolePermission {
    READ = "read",
    WRITE = "write",
    DELETE = "delete",
    UPDATE = "update"
}

export enum Roles {
    ADMIN = "admin",
    USER = "user",
}

export const RolePermissions : Record<Roles, RolePermission[]> = {
    [Roles.ADMIN]: [
        RolePermission.READ,
        RolePermission.WRITE,
        RolePermission.DELETE,
        RolePermission.UPDATE,
    ],
    [Roles.USER]: [
        RolePermission.READ
    ],
}

export const HasPermission = (role: Roles, permission: RolePermission): boolean => {
    return RolePermissions[role].includes(permission);
}

export default interface RoleModel {
    _id?: ObjectId;
    name: string;
    menuId?: ObjectId[] | MenuModel[];
    permissions: RolePermission[];
}