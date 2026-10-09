import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils'

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404, 'ROUTE_NOT_FOUND'))
}
