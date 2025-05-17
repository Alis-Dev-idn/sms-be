import {AnyExpression, Model} from "mongoose";
import {joiCreateMenu} from "../../config/joi/MenuJoi";
import Menu from "./Menu";
import MenuModel from "./MenuModel";


class MenuService {
    private model: Model<MenuModel> = Menu;

    public async getAllMenus(projection?: AnyExpression): Promise<{total: number, data: MenuModel[] }> {
        const result = await this.model.aggregate([
            {
                $facet: {
                    total: [
                        {$count: "total"}
                    ],
                    data: [
                        {$sort: {createdAt: -1}},
                        {$project: projection},
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

        if (result.length === 0)
            return {total: 0, data: []};
        return {
            total: result[0].total,
            data: result[0].data
        };
    }

    public async saveMenu(menu: MenuModel): Promise<MenuModel | unknown> {
        return new Promise(async (resolve, reject) => {
            try {
                const {error} = joiCreateMenu.validate(menu);
                if (error)
                    return reject({status: 400, errorMsg: error.details[0].message});

                const cekName = await this.model.findOne({name: menu.name});
                if (cekName)
                    return reject({status: 400, errorMsg: "Menu name already exists"});

                const save = await this.model.create<MenuModel>(menu);
                resolve({
                    _id: save._id,
                    name: menu.name,
                });
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new MenuService();