import {model, ObjectId, Schema} from "mongoose";
import UserModel from "../../userManagement/user/UserModel";
import {IBranch} from "../branch/Branch";
import {IObjectId} from "../../config/Database";

export interface IStockTransaction {
    _id?: IObjectId,
    name : IObjectId,
    qtyOut: number,
    requestBy:  | UserModel,
    branchId: IObjectId | IBranch,
    createdBy: IObjectId | UserModel,
    updatedBy?: IObjectId | UserModel,
    transDate: Date,
    createdAt?: Date,
    updatedAt?: Date,
}

export default model<IStockTransaction>("stock_transaction", new Schema<IStockTransaction>({
    name : {
        type: Schema.Types.ObjectId,
        ref: "stock",
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
        required: false,
    },
    transDate: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
}));