import {Model, AnyExpression} from "mongoose";
import Stock, {IStock} from "./Stock";
import {joiCreateStock} from "../../config/joi/StockJoi";


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
}