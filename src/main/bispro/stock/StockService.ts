import mongoose, {Model, AnyExpression} from "mongoose";
import Stock, {IStock} from "./Stock";
import {joiCreateStock} from "../../config/joi/StockJoi";
import {IdValidate} from "../../config/Database";


export default new class StockService {
    private readonly model: Model<IStock> = Stock;

    public listStocks(projection?: AnyExpression): Promise<{count: number, data: IStock[] }> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.model.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        fullName: 1
                                    }
                                },
                            ],
                            as: "createdBy"
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "updatedBy",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        fullName: 1
                                    }
                                },
                            ],
                            as: "updatedBy"
                        }
                    },
                    {
                        $unwind: {
                            path: "$createdBy",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $set: {
                            createdBy: "$createdBy.fullName"
                        }
                    },
                    {
                        $unwind: {
                            path: "$updatedBy",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $set: {
                            updatedBy: "$updatedBy.fullName"
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

                resolve({count: 0, data: result});
            } catch (error) {
                console.error(error);
                reject(error);
            }
        })
    }

    public addStock(data: IStock): Promise<IStock> {
        return new  Promise<IStock>(async (resolve, reject) => {
            try {
                if(!data.qty)
                    data.qty = 0;
                if(data.qty < 0)
                    return reject({status: 400, errorMsg: "Quantity cannot be negative"});
                data.stockDate = new Date();
                const {error} = joiCreateStock.validate(data);
                if(error)
                    return reject({status: 400, errorMsg: error.details[0].message});
                const cekDb = await this.model.findOne({name: data.name});
                if (cekDb)
                    return reject({status: 400, errorMsg: "Stock with this name already exists"});
                const {qty, name, stockDate, expiryDate, createdBy, createdAt} = await this.model.create(data);
                resolve({qty, name, stockDate, expiryDate, createdBy, createdAt});
            } catch (error) {
                reject(error);
            }
        })
    }

    public async updateStock(
        id: string,
        updatedBy: string,
        newName?: string,
        newQty?: number,
        newExpiryDate?: Date,
    ): Promise<any> {
        if(!IdValidate(id))
            throw {status: 400, errorMsg: "Invalid stock ID"};

        const cekId = await this.model.findByIdAndUpdate(id);
        if(!cekId)
            throw {status: 404, errorMsg: "Stock not found"};

        const updateData: Partial<IStock> = {};
        if(newName) updateData.name = newName;
        if(newQty !== undefined) {
            if(newQty < 0)
                throw {status: 400, errorMsg: "Quantity cannot be negative"};
            updateData.qty = newQty;
        }
        if(newExpiryDate) updateData.expiryDate = newExpiryDate;
        updateData.updatedBy = new mongoose.Types.ObjectId(updatedBy);

        const updatedStock = await this.model.findByIdAndUpdate(id, {
            ...updateData
        }, {new: true});
        if(!updatedStock)
            throw {status: 404, errorMsg: "Stock not found"};
        return {
            _id: updatedStock._id,
            name : updatedStock.name,
            qty: updatedStock.qty,
            expiryDate: updatedStock.expiryDate,
        };
    }
}