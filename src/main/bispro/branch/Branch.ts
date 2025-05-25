import {model, ObjectId, Schema} from "mongoose";


export interface IBranch {
    _id?: ObjectId,
    name: string,
    address: string,
    createdAt?: Date,
    updatedAt?: Date,
}

export default model<IBranch>('branch', new Schema<IBranch>({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
}));