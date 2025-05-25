import {model, ObjectId, Schema} from "mongoose";
import UserModel from "../../userManagement/user/UserModel";


export interface IStock {
    _id?: ObjectId,
    name: string,
    qty: number,
    expiryDate: Date,
    stockDate: Date,
    createdBy: ObjectId | UserModel,
    updatedBy: ObjectId | UserModel,
    createdAt?: Date,
    updatedAt?: Date,
}

export default model<IStock>("stock", new Schema<IStock>({
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    stockDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
}, {
    timestamps: true,
}));