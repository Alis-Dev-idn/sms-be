import {model, Schema} from "mongoose";
import {MenuEntity} from "./MenuEntity";

export default model<MenuEntity>("menu", new Schema<MenuEntity>({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
}));