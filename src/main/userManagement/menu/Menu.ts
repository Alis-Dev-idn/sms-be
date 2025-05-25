import {model, Schema} from "mongoose";
import MenuModel from "./MenuModel";

export default model<MenuModel>("menu", new Schema<MenuModel>({
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
}));
