import { ZodIssue } from "zod";
import { TErrorMessage, TGenericErrorResponse } from "../../interface/error";

const handleZodError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  const errorMessages: TErrorMessage[] = err?.issues.map((issue: ZodIssue) => ({
    path: issue.path[0],
    message: issue.message,
  }));

  return {
    statusCode,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleZodError;
