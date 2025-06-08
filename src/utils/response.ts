import { Response } from "express";

export const responseHandler = (res: Response, statusCode: 200, success: boolean = true, message: string = "success", data: any) => {
    return res.status(statusCode).json({ success, message, data, timestamp: new Date().toJSON() })
}