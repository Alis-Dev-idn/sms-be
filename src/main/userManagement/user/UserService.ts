import {Model, ProjectionType} from "mongoose";
import UserModel from "./UserModel";
import {joiUserCreate} from "../../config/joi/UserJoi";
import {hastPassword} from "../../auth/AuthUtils";
import User from "./User";
import {IdValidate} from "../../config/Database";
import RoleModel from "../role/RoleModel";
import Role from "../role/Role";


class UserService {
    private model: Model<UserModel> = User;
    private role: Model<RoleModel> = Role;

    public getUserById(id: string, projection?: ProjectionType<any>): Promise<UserModel | null> {
        return this.model.findById(id, projection).populate("roleId", {__v: 0}).lean();
    }

    public async getUserByUserName(userName: string, projection?: ProjectionType<any>): Promise<UserModel | null> {
        const result = await this.model.aggregate([
            {
                $match: {
                    userName: {$regex: userName, $options: "i"}
                }
            },
            {
                $lookup: {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                __v: 0,
                                createdAt: 0,
                                updatedAt: 0
                            }
                        },
                        {
                            $lookup: {
                                from: "menus",
                                localField: "menuId",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1
                                        }
                                    }
                                ],
                                as: "menuId"
                            }
                        },
                        {
                            $addFields: {
                                menuId: {
                                    $map: {
                                        input: "$menuId",
                                        as: "menu",
                                        in: "$$menu.name"
                                    }
                                }
                            }
                        }
                    ],
                    as: "roleId"
                }
            },
            {
                $addFields: {
                    roleId: {
                        $arrayElemAt: ["$roleId", 0]
                    }
                }
            }
        ])
        return result[0];
    }

    public getAllUser(projection?: ProjectionType<any>): Promise<UserModel[]> {
        return this.model.find({}, projection).populate({
            path: "createdBy",
            select: {fullName: 1}
        }).lean();
    }

    public getTotalUser(): Promise<number> {
        return this.model.find().countDocuments();
    }

    public createUser(data: UserModel): Promise<UserModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const {error} = joiUserCreate.validate(data);
                if(error)
                    return reject({status: 400, errorMsg: error.details[0].message});
                if(!IdValidate(data.roleId.toString()))
                    return reject({status: 400, errorMsg: "Invalid roleId"});

                const cekUser = await this.model.findOne({userName: data.userName}).lean();
                if (cekUser)
                    return reject({status: 400, errorMsg: "User already exists"});

                const cekRole = await this.role.findById(data.roleId);
                if (!cekRole)
                    return reject({status: 400, errorMsg: "Role not found"});

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