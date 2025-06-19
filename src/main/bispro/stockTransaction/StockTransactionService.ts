import mongoose, {Model} from "mongoose";
import StockTransaction, {IStockTransaction} from "./StockTransaction";
import Stock, {IStock} from "../stock/Stock";
import {IdValidate} from "../../config/Database";
import Branch, {IBranch} from "../branch/Branch";
import {JoiCreateStockTransaction} from "../../config/joi/StockTransactionJoi";
import UserModel from "../../userManagement/user/UserModel";
import User from "../../userManagement/user/User";


export default new class StockTransactionService {
    private readonly stock: Model<IStock> = Stock;
    private readonly user: Model<UserModel> = User;
    private readonly branch: Model<IBranch> = Branch;
    private readonly model: Model<IStockTransaction> = StockTransaction;

    public async listStockTransactions(): Promise<any> {
        const result = await this.model.aggregate([
            {
                $lookup: {
                    from: "stocks",
                    localField: "name",
                    foreignField: "_id",
                    as: "name"
                }
            },
            {
                $unwind: {
                    path: "$name",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $set: {
                    name: "$name.name"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "requestBy",
                    foreignField: "_id",
                    as: "requestBy"
                }
            },
            {
                $unwind: {
                    path: "$requestBy",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $set: {
                    requestBy: "$requestBy.fullName"
                }
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchId",
                    foreignField: "_id",
                    as: "branch"
                }
            },
            {
                $unwind: {
                    path: "$branch",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $set: {
                    branch: "$branch.name"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
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
                $lookup: {
                    from: "user",
                    localField: "updatedBy",
                    foreignField: "_id",
                    as: "updatedBy"
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
                        {$sort: {transDate: -1}},
                        {
                            $project: {
                                __v: 0,
                                branchId: 0,
                            }
                        }
                    ]
                }
            },
            {
                $set: {
                    total: {$arrayElemAt: ["$total.total", 0]},
                    data: "$data"
                }
            },
            {
                $project: {
                    total: 1,
                    data: 1
                }
            }
        ])
        return result[0].data.length > 0 ? result[0] : {total: 0, data: []};
    }

    public async addStockTransaction(
        userId: string,
        data: any
    ): Promise<any> {
        const {error} = JoiCreateStockTransaction.validate(data);
        if (error)
            throw ({status: 400, errorMsg: error.details[0].message});
        const {stockId, branchId, qtyOut} = data;

        if(!IdValidate(userId) || !IdValidate(stockId) || !IdValidate(branchId))
            throw ({status: 400, errorMsg: "Invalid ID format"});

        const stock = await this.stock.findById(stockId);
        if (!stock)
            throw ({status: 400, errorMsg: "Stock not found"});

        const branch = await this.branch.findById(branchId);
        if (!branch)
            throw ({status: 400, errorMsg: "Branch not found"});

        if (stock.qty < qtyOut || qtyOut <= 0)
            throw ({status: 400, errorMsg: `Insufficient stock quantity maximum available is ${stock.qty}`});

        stock.qty -= qtyOut;
        stock.updatedBy = new mongoose.Types.ObjectId(userId);

        await this.stock.findByIdAndUpdate(stockId, stock);

        const newTransaction = await this.model.create({
            name: stockId,
            qtyOut: qtyOut,
            requestBy: new mongoose.Types.ObjectId(userId),
            branchId: new mongoose.Types.ObjectId(branchId as string),
            createdBy: new mongoose.Types.ObjectId(userId),
            transDate: new Date(),
        });

        return {
            _id: newTransaction._id,
            name: stock.name,
            qtyOut: newTransaction.qtyOut,
            requestBy: (await this.user.findById(userId).select("fullName") as UserModel).fullName,
            branch: branch.name
        }
    }
}