import {Model} from "mongoose";
import RoleModel from "./RoleModel";
import {RoleEntity} from "./RoleEntity";
import {joiCreateRole} from "../joi/RoleJoi";


class RoleService {
    private model: Model<RoleEntity> = RoleModel;

    public getTotalRole(): Promise<number> {
        return this.model.find().countDocuments();
    }

    public createRole(data: RoleEntity): Promise<RoleEntity> {
        return new Promise(async (resolve, reject) => {
            try {
                const {error} = joiCreateRole.validate(data);
                if (error)
                    return reject({status: 400, errorMsg: error.details[0].message});
                const cekRole = await this.model.findOne({name: data.name});
                if (cekRole)
                    return reject({status: 400, errorMsg: "Role already exists"});
                const role = await this.model.create(data);
                resolve(role);
            } catch (error) {
                reject({status: 500, errorMsg: "Internal Server Error"});
            }
        });
    }
}

export default new RoleService();