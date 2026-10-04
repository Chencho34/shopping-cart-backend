import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { AppError } from '../utils'

export const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.status || 500).json({
      success: false,
      status: err.status,
      error: {
        message: err.message || 'Internal Server Error',
        code: err.code,
        details: err.details
      }
    })
    return
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  })
}
