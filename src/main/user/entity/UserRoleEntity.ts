import {ObjectId} from "mongoose";

export type IPermission = "read" | "write" | "delete" | "update"
export interface  UserRoleEntity {
    id?: ObjectId,
    role: string
    permissions: IPermission[]
}