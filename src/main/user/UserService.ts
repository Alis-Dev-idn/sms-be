import {Model, ProjectionType} from "mongoose";
import {UserEntity} from "./UserEntity";
import UserModel from "./UserModel";
import {joiUserCreate} from "../joi/UserJoi";
import {hastPassword} from "../auth/AuthUtils";


class UserService {
    private model: Model<UserEntity> = UserModel;

    public getUserById(id: string, projection?: ProjectionType<any>): Promise<UserEntity | null> {
        return this.model.findById(id, projection).populate("roleId", {__v: 0}).lean();
    }

    public getUserByUserName(userName: string, projection?: ProjectionType<any>): Promise<UserEntity | null> {
        return this.model.findOne({userName}, projection).populate("roleId", {__v: 0}).lean();
    }

    public getAllUser(projection?: ProjectionType<any>): Promise<UserEntity[]> {
        return this.model.find({}, projection).lean();
    }

    public getTotalUser(): Promise<number> {
        return this.model.find().countDocuments();
    }

    public createUser(data: UserEntity): Promise<UserEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const {error} = joiUserCreate.validate(data);
                if(error)
                    return reject({status: 400, errorMsg: error.details[0].message});
                const cekUser = await this.model.findOne({userName: data.userName}).lean();
                if (cekUser)
                    return reject({status: 400, errorMsg: "User already exists"});

                data.password = await hastPassword(data.password);
                const user = await this.model.create(data);
                resolve(user);
            } catch (error) {
                console.log("Error: ", error);
                reject({status: 500, errorMsg: "Internal Server Error"});
            }
        });
    }
}

export default new UserService();