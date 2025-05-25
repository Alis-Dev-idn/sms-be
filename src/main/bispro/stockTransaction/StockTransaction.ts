import {model, ObjectId, Schema} from "mongoose";
import UserModel from "../../userManagement/user/UserModel";
import {IBranch} from "../branch/Branch";

export interface IStockTransaction {
    _id?: ObjectId,
    name : string,
    qtyOut: number,
    requestBy: ObjectId | UserModel,
    branchId: ObjectId | IBranch,
    createdBy: ObjectId | UserModel,
    updatedBy: ObjectId | UserModel,
    transDate: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

export default model<IStockTransaction>("stock_transaction", new Schema<IStockTransaction>({
    name : {
        type: String,
        required: true,
    },
    qtyOut: {
        type: Number,
        required: true,
    },
    requestBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "branch",
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
    },
    transDate: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
}));