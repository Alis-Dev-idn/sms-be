import {AnyExpression, Model } from "mongoose";
import RoleModel from "./RoleModel";
import {joiCreateRole} from "../../config/joi/RoleJoi";
import MenuModel from "../menu/MenuModel";
import {IdValidate} from "../../config/Database";
import Menu from "../menu/Menu";
import Role from "./Role";


class RoleService {
    private model: Model<RoleModel> = Role;
    private menu: Model<MenuModel> = Menu;

    public getTotalRole(): Promise<number> {
        return this.model.find().countDocuments();
    }

    public async getAllRole(projection?: AnyExpression): Promise<{total: number, data: RoleModel[]}> {
        let result = await this.model.aggregate([
            {
                $lookup: {
                    from: "menus",
                    localField: "menuId",
                    foreignField: "_id",
                    pipeline: [
                        {$project: {_id: 0, name: 1}}
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
            },
            {
                $facet: {
                    total: [{$count: "total"}],
                    data: [
                        {$sort: {createdAt: -1}},
                        {$project: {...projection}}
                    ]
                }
            },
            {
                $project: {
                    total: {$arrayElemAt: ["$total.total", 0]},
                    data: "$data"
                }
            }
        ])
        if(result.length === 0)
            return {total: 0, data: []};
        return {total: result[0].total, data: result[0].data};
    }

    public createRole(data: RoleModel): Promise<RoleModel> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Create Role: ", data);
                const {error} = joiCreateRole.validate(data);
                if (error)
                    return reject({status: 400, errorMsg: error.details[0].message});
                const cekRole = await this.model.findOne({name: data.name});
                if (cekRole)
                    return reject({status: 400, errorMsg: "Role already exists"});

                const invalidId = data.menuId?.filter((id) => !IdValidate(id.toString()));
                if (invalidId?.length)
                    return reject({status: 400, errorMsg: "Invalid menuId"});

                const existingMenu = await this.menu.find({_id: {$in: data.menuId}});
                const existingMenuIds = existingMenu.map((menu) => menu._id.toString());
                const missingMenuIds = data.menuId?.filter((id) => !existingMenuIds.includes(id.toString()));
                if (missingMenuIds?.length)
                    return reject({status: 400, errorMsg: "MenuId not found"});

                const role = await this.model.create(data);
                resolve(role);
            } catch (error) {
                console.log("Error creating role: ", error);
                reject({status: 500, errorMsg: "Internal Server Error"});
            }
        });
    }
}

export default new RoleService();