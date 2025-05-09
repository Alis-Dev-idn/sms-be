import {Schema} from "mongoose";
import {UserRoleEntity} from "../entity/UserRoleEntity";

export default model<UserRoleEntity>('user_role', new Schema<UserRoleEntity>({
    role: {
        type: String,
        required: true,
    },
    permissions: {
        type: [String],
        required: true,
    }
}, {
    timestamps: {
        createdAt: false,
        updatedAt: true
    }
}));