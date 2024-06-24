import { Response } from "express";

type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  let responseData: TResponseData<T> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
  };
  if (data.token) {
    responseData = { ...responseData, token: data.token };
  }
  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
