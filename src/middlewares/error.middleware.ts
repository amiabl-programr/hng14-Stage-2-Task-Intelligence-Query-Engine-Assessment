import { Request, Response, NextFunction } from 'express';

interface AppError {
  statusCode?: number;
  api?: string;
  message?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  
  if (err.statusCode === 502 && err.api) {
    return res.status(502).json({
      status: 'error',
      message: `${err.api} returned an invalid response`,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
