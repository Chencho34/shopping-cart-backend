import { NextFunction, Request, Response } from 'express'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.stack)

  res.status(err.status || 500).json({
    succes: false,
    error: {
      status: err.status,
      message: err.message || 'Internal Server Error'
    }
  })
}
