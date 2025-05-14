import {MenuEntity} from "./MenuEntity";
import {Model, ProjectionType} from "mongoose";
import MenuModel from "./MenuModel";
import {joiCreateMenu} from "../joi/MenuJoi";


class MenuService {
    private model: Model<MenuEntity> = MenuModel;

    public async getAllMenus(projection?: ProjectionType<any>): Promise<MenuEntity[]> {
        return this.model.find({}, projection).lean();
    }

    public async saveMenu(menu: MenuEntity): Promise<MenuEntity | unknown> {
        return new Promise(async (resolve, reject) => {
            try {
                const {error} = joiCreateMenu.validate(menu);
                if (error)
                    return reject({status: 400, errorMsg: error.details[0].message});

                const cekName = await this.model.findOne({name: menu.name});
                if (cekName)
                    return reject({status: 400, errorMsg: "Menu name already exists"});

                const save = await this.model.create<MenuEntity>(menu);
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