import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let data: any = {
    message: 'Internal server error',
    originalMessage: err.message,
  };

  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  res.status(statusCode).json(data);
};

export default errorHandler;
