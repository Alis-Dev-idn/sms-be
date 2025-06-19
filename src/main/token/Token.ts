import {model, Schema} from "mongoose";
import UserModel from "../userManagement/user/UserModel";

export interface IToken {
    _id?: Schema.Types.ObjectId;
    idToken: string;
    idUser: Schema.Types.ObjectId | UserModel;
    tokenValue: string;
    refreshTokenValue: string;
}

export default model<IToken>("token", new Schema<IToken>({
    idToken: {
        type: String,
        required: true
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    tokenValue: {
        type: String,
        required: true
    },
    refreshTokenValue: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
}))