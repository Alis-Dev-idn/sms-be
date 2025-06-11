import joi from "joi";

export const JoiCreateStockTransaction = joi.object({
    stockId: joi.string().required().messages({
        "string.empty": "Stock ID is required",
        "any.required": "Stock ID is required"
    }),
    branchId: joi.string().required().messages({
        "string.empty": "Branch ID is required",
        "any.required": "Branch ID is required"
    }),
    qtyOut: joi.number().required().messages({
        "number.base": "Quantity out must be a number",
        "any.required": "Quantity out is required"
    })
});