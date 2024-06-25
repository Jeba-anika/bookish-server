import { TErrorMessage, TGenericErrorResponse } from "../../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  const errorMessages: TErrorMessage[] = [
    {
      path: Object.keys(err.keyPattern)[0],
      message: err.message,
    },
  ];

  return {
    statusCode,
    message: "Duplicate Entry",
    errorMessages,
  };
};

export default handleDuplicateError;
