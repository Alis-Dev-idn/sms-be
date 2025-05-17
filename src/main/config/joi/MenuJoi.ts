import joi, {ObjectSchema} from "joi";

export const joiCreateMenu: ObjectSchema = joi.object({
    name: joi.string().required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name cannot be empty',
        'any.required': 'Name is required'
    })
})