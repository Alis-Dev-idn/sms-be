import RoleModel from "../role/RoleModel";
import {IObjectId} from "../../config/Database";

export default interface UserModel {
    _id?: IObjectId;
    fullName: string;
    userName: string;
    password: string;
    roleId: IObjectId | RoleModel;
    branchId?: IObjectId;
    createdBy?: IObjectId | UserModel;
    createdAt?: Date;
    updatedAt?: Date;
}