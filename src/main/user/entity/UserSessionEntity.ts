import {ObjectId} from "mongoose";

export interface UserSessionEntity {
    id?: ObjectId,
    token: string,
}