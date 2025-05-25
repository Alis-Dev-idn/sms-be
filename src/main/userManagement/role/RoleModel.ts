import {ObjectId} from "mongoose";
import MenuModel from "../menu/MenuModel";

export enum RolePermission {
    USER_READ = "user:read",
    USER_CREATE = "user:create",
    USER_UPDATE = "user:update",
    ADMIN_READ = "admin:read",
    ADMIN_CREATE = "admin:create",
    ADMIN_DELETE = "admin:delete",
    ADMIN_UPDATE = "admin:update",
    WORKER_READ = "worker:read",
    WORKER_CREATE = "worker:create",
    WORKER_DELETE = "worker:delete",
    WORKER_UPDATE = "worker:update",
}

export const RolePermissionList: string[] = [
    RolePermission.USER_READ,
    RolePermission.USER_CREATE,
    RolePermission.USER_UPDATE,
    RolePermission.ADMIN_READ,
    RolePermission.ADMIN_CREATE,
    RolePermission.ADMIN_DELETE,
    RolePermission.ADMIN_UPDATE,
    RolePermission.WORKER_READ,
    RolePermission.WORKER_CREATE,
    RolePermission.WORKER_DELETE,
    RolePermission.WORKER_UPDATE,
]

export const HasPermission = (permission: string[]): boolean => {
    return permission.every(permission => RolePermissionList.includes(permission));
}

export const hastPermission = (permission: string[], access: string[]): boolean => {
    return access.some(access => permission.includes(access));
}

export default interface RoleModel {
    _id?: ObjectId;
    name: string;
    menuId?: ObjectId[] | MenuModel[];
    permissions: RolePermission[];
}