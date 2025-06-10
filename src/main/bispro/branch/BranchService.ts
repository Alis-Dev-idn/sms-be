import {Model} from "mongoose";
import Branch, {IBranch} from "./Branch";
import {IdValidate} from "../../config/Database";
import {JoiBranchCreate, JoiBranchUpdate} from "../../config/joi/BranchJoi";


export default new class BranchService {
    private readonly model: Model<IBranch> = Branch;

    public async getBranch(
        byId?: string,
        byName?: string,
        byAddress?: string
    ): Promise<{total: number, data: IBranch[]}> {
        const result = await this.model.aggregate([
            {
                $match: {
                    ...(byId ? {_id: byId} : {}),
                    ...(byName ? {name: {$regex: byName, $options: "i"}} : {}),
                    ...(byAddress ? {address: {$regex: byAddress, $options: "i"}} : {})
                }
            },
            {
                $facet: {
                    total: [{$count: "total"}],
                    data: [
                        {$sort: {createdAt: -1}},
                        {$project: {__v: 0}}
                    ]
                }
            },
            {
                $set: {
                    total: {$arrayElemAt: ["$total.total", 0]},
                    data: "$data"
                }
            },
            {$project: {total: 1, data: 1}}
        ])
        return result[0].data.length > 0 ? result[0] : {total: 0, data: []};
    }

    public async createBranch(branch: IBranch): Promise<IBranch> {
        if(!branch.name || !branch.address)
            throw({status: 400, errorMsg: "Name and address are required"});

        const {error} = JoiBranchCreate.validate(branch);
        if(error)
            throw({status: 400, errorMsg: error.details[0].message});

        const cekName = await this.model.findOne({name: branch.name});
        if(cekName)
            throw({status: 400, errorMsg: "Branch name already exists"});

        return this.model.create(branch);
    }

    public async updateBranch(
        body: any
    ): Promise<any> {

        const {error} = JoiBranchUpdate.validate(body);
        if (error)
            throw({status: 400, errorMsg: error.details[0].message});

        const {id, name, address} = body;

        if(!id)
            throw({status: 400, errorMsg: "Branch ID is required"});

        if(!IdValidate(id))
            throw({status: 400, errorMsg: "Invalid branch ID"});

        if(!name && !address)
            throw({status: 400, errorMsg: "At least one field (name or address) must be provided for update"});

        const cekBranch = await this.model.findById(id);
        if(!cekBranch)
            throw({status: 404, errorMsg: "Branch not found"});

        if(address)
            cekBranch.name = name;
        if(address)
            cekBranch.address = address;

        return this.model.findByIdAndUpdate(id, cekBranch, {new: true, runValidators: true });
    }
}