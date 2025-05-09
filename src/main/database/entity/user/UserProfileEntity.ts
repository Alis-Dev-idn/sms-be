import {ObjectId} from 'mongoose'
import {UserRoleEntity} from "./UserRoleEntity";

export interface UserProfileEntity {
    id?: ObjectId,
    name: string,
    brith_day: number,
    role: UserRoleEntity,
}