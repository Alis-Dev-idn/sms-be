import {model, Schema} from "mongoose";
import RoleModel from "./RoleModel";

export default model<RoleModel>("role", new Schema<RoleModel>({
    name: {
        type: String,
        required: true,
    },
    menuId: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "menu"
        }],
        required: true,
    },
    permissions: {
        type: [{
            type: String,
            enum: ["read", "write", "delete", "update"]
        }],
        required: true,
    }
}, {
    timestamps: true
}));