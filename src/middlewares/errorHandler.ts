import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { AppError } from '../utils'

export const errorHandler: ErrorRequestHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.name  )
  const { message, status } = err

  if (err instanceof AppError) {
    res.status(err.status || 500).json({
      success: false,
      error: {
        status: status,
        message: message || 'Internal Server Error'
      }
    })
    return
  }

  console.error('Unexpected error', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  })

}
