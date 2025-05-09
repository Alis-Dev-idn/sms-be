import {Schema, model} from "mongoose";
import {UserEntity} from "../../entity/user/UserEntity";

export default model<UserEntity>('user', new Schema<UserEntity>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "user_profile",
        required: true
    },
    session: {
        type: Schema.Types.ObjectId,
        ref: "user_session",
        required: true
    }
}, {
    timestamps: true,
}));