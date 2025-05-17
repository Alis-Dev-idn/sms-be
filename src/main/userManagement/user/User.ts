import {model, Schema} from "mongoose";
import UserModel from "./UserModel";

export default model<UserModel>("user", new Schema<UserModel>({
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