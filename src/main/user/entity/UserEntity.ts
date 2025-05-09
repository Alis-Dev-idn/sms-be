import {ObjectId} from "mongoose"
import {UserProfileEntity} from "./UserProfileEntity";
import {UserSessionEntity} from "./UserSessionEntity";

export interface UserEntity {
    id?: ObjectId,
    email: string,
    username: string,
    password: string,
    profile: ObjectId | UserProfileEntity,
    session: ObjectId | UserSessionEntity,
}