import joi, {ObjectSchema} from "joi";

export const joiCreateStock: ObjectSchema = joi.object({
    name: joi.string().min(3).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 3 characters long',
        'any.required': 'Name is required'
    }),
    qty: joi.number().integer().min(0).required().messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity cannot be negative',
        'any.required': 'Quantity is required'
    }),
    expiryDate: joi.date().greater('now').required().messages({
        'date.base': 'Expiry date must be a valid date',
        'date.greater': 'Expiry date must be in the future',
        'any.required': 'Expiry date is required'
    }),
    stockDate: joi.date().less('now').required().messages({
        'date.base': 'Stock date must be a valid date',
        'date.less': 'Stock date must be in the past',
        'any.required': 'Stock date is required'
    }),
    createdBy: joi.any().required().messages({
        'string.base': 'Created by must be a string',
        'string.empty': 'Created by cannot be empty',
        'any.required': 'Created by is required'
    }),
})