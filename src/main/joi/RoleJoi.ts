import joi, {ObjectSchema} from "joi";
import {RoleEntity} from "../role/RoleEntity";

export const joiCreateRole: ObjectSchema<RoleEntity> = joi.object<RoleEntity>({
    name: joi.string().min(3).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 3 characters long',
        'any.required': 'Name is required'
    }),
    menuId: joi.array().items(joi.string()).allow(null).messages({
        'array.base': 'Menu ID must be an array of strings',
        'string.base': 'Menu ID must be a string',
        'any.required': 'Menu ID is required'
    }),
    permissions: joi.array().items(joi.string().valid("read", "write", "delete", "update")).required().messages({
        'array.base': 'Permissions must be an array',
        'string.base': 'Permission must be a string',
        'any.required': 'Permissions are required'
    })
});