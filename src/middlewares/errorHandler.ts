import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { AppError, isBodyParserError } from '../utils'
import { env } from '../config/env'

const isProduction = env.NODE_ENV === 'production'

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof AppError) {
    res.status(err.status || 500).json({
      success: false,
      error: {
        message: err.message || 'Internal Server Error',
        code: err.code,
        details: err.details
      }
    })
    return
  }

  if (isBodyParserError(err) && err.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Malformed JSON in request body',
        code: 'INVALID_JSON'
      }
    })
    return
  }

  console.error(`[${req.method}] ${req.originalUrl}`, err)

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      // Solo en desarrollo, nunca en produccion
      ...(!isProduction && { stack: err.stack })
    }
  })
}
