import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.name  )
  const { message, status } = err

  if (err instanceof AppError) {
    return res.status(err.status || 500).json({
      succes: false,
      error: {
        status: status,
        message: message || 'Internal Server Error'
      }
    })
  }

  console.error('Unexpected error', err)
  return res.status(500).json({
    succes: false,
    message: 'Internal server error',
    error: err.message
  })

}
