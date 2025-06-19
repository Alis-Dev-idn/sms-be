import { Response } from "express";

type ErrorResponse = {
    status?: number;
    error?: string;
}

type SuccessResponse<T = any> = {
    message?: string;
    data?: T
}

export const SendOk = <T>(
    res: Response,
    data?: T | string,
    message?: string,
) => {
    const response: SuccessResponse = {}
    if(typeof data === "string") {
        response.message = data
    } else {
        response.data = data
        if(message) response.message = message
    }
    return res.status(200).json(response)
}

export const SendError = (
    res: Response,
    error?: any,
) => {
    const response: ErrorResponse = {}

    if(error.errorMsg) {
        response.status = error.status
        response.error = error.errorMsg
    }

    return res.status( response.status || 500).json(
        response.error ? { error: response.error } : { error: "Internal Server Error" }
    )
}