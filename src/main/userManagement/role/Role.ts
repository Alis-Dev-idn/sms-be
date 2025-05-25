import {model, Schema} from "mongoose";
import RoleModel, {RolePermissionList} from "./RoleModel";

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
            enum: RolePermissionList
        }],
        required: true,
    }
}, {
    timestamps: true
}));