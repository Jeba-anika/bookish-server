export type TErrorMessage = {
  path: string;
  message: string;
};
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: TErrorMessage[];
};
