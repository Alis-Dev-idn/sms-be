import joi from "joi";

export const JoiBranchCreate = joi.object({
    name: joi.string().min(6).required().messages({
        "string.empty": "Branch name is required",
        "any.required": "Branch name is required",
        "string.min": "Branch name must be at least 6 characters long"
    }),
    address: joi.string().required().messages({
        "string.empty": "Branch address is required",
        "any.required": "Branch address is required"
    })
})

export const JoiBranchUpdate = joi.object({
    id: joi.string().required().messages({
        "string.empty": "Branch ID is required",
        "any.required": "Branch ID is required"
    }),
    name: joi.string().min(6).optional().messages({
        "string.min": "New branch name must be at least 6 characters long"
    }),
    address: joi.string().optional()
})