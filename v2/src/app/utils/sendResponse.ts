import { Response } from "express";

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode).send({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
