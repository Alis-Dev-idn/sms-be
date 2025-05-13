import {model, Schema} from "mongoose";
import {UserEntity} from "./UserEntity";

export default model<UserEntity>("user", new Schema<UserEntity>({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "role",
        required: true
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "branch",
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: false
    }
}, {
    timestamps: true
}));