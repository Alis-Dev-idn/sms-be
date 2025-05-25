import joi, {ObjectSchema} from "joi";
import RoleModel from "../../userManagement/role/RoleModel";

export const joiCreateRole: ObjectSchema<RoleModel> = joi.object<RoleModel>({
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
    permissions: joi.array().items(joi.string().valid(
        'user:read',
        'user:create',
        'user:update',
        'admin:read',
        'admin:create',
        'admin:delete',
        'admin:update',
        'worker:read',
        'worker:create',
        'worker:delete',
        'worker:update'
    )).required().messages({
        'array.base': 'Permission must be an array',
        'string.base': 'Permission must be a string',
        'any.only': 'Permission must be one of [user:read, user:create, user:update, admin:read, admin:create, admin:delete, admin:update, worker:read, worker:create, worker:delete, worker:update]',
        'array.includesRequiredUnknowns': 'Permission must include valid permission values',
        'array.min': 'Permission must have at least one value',
        'array.empty': 'Permission cannot be empty',
        'any.required': 'Permissions is required'
    })
});