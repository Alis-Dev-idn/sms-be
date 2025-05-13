import {model, Schema} from "mongoose";
import {RoleEntity} from "./RoleEntity";


export default model<RoleEntity>("role", new Schema<RoleEntity>({
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