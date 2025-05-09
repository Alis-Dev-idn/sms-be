import { Schema, model } from "mongoose";
import {UserProfileEntity} from "../entity/UserProfileEntity";

export default model<UserProfileEntity>('user_profile', new Schema<UserProfileEntity>({
    name: {
        type: String,
        required: true,
    },
    brith_day: {
        type: Number,
        required: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'UserRole',
        required: true,
    },
}, {
    timestamps: true,
}));