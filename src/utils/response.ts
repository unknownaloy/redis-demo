import { Response } from "express";

type ResponseDto = {
  res: Response;
  success: boolean;
  message: any;
  statusCode?: number;
  data?: any;
};

export const responseHandler = ({
  res,
  success,
  message,
  statusCode = 200,
  data,
}: ResponseDto) => {
  return res
    .status(statusCode)
    .json({ success, message, data, timestamp: new Date().toJSON() });
};
