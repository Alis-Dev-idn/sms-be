import {Schema, model} from "mongoose";
import {UserSessionEntity} from "../../entity/user/UserSessionEntity";

export default model<UserSessionEntity>("user_session", new Schema<UserSessionEntity>({
    token: {type: String, required: true},
}, {
    timestamps: true,
}))