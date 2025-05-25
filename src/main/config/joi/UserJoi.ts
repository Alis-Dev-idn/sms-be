import joi, {ObjectSchema} from 'joi';
import mongoose from "mongoose";
import UserModel from "../../userManagement/user/UserModel";

export const joiUserLogin: ObjectSchema = joi.object({
    userName: joi.string().min(5).required().messages({
        'string.base': 'User name must be a string',
        'string.empty': 'User name cannot be empty',
        'string.min': 'User name must be at least 5 characters long',
        'any.required': 'User name is required'
    }),
    password: joi.string().min(5).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 5 characters long',
        'any.required': 'Password is required'
    })
});

export const joiUserCreate: ObjectSchema<UserModel> = joi.object<UserModel>({
    fullName: joi.string().min(5).required().messages({
        'string.base': 'Full name must be a string',
        'string.empty': 'Full name cannot be empty',
        'string.min': 'Full name must be at least 5 characters long',
        'any.required': 'Full name is required'
    }),
    userName: joi.string().min(5).required().messages({
        'string.base': 'User name must be a string',
        'string.empty': 'User name cannot be empty',
        'string.min': 'User name must be at least 5 characters long',
        'any.required': 'User name is required'
    }),
    password: joi.string().min(5).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 5 characters long',
        'any.required': 'Password is required'
    }),
    roleId: joi.alternatives().try(
        joi.string().required(),
        joi.custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid', {value});
            }
            return value;
        }).required()
    ).messages({
        'any.invalid': 'Role ID must be a valid ObjectId or string',
        'any.required': 'Role ID is required'
    }),
    branchId: joi.string().allow(null),
    createdBy: joi.string().allow(null)
})