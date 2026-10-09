import { NextFunction, Request, Response} from 'express'
import { AppError } from '../utils'
import { verifyAccessToken } from '../services/token.service'
import { ACCESS_COOKIE } from '../config/cookies'

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.[ACCESS_COOKIE]

  if(!token) {
    next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'))
    return
  }
  
  req.user = verifyAccessToken(token)
  next()
}

export const authorize = (...roles: Array<'user' | 'admin'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'))
      return
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403, 'FORBIDDEN'))
      return
    }
    next()
  }
}

export const requireSelfOrAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'))
    return
  }

  const targetId = Number(req.params.id)

  if (!Number.isInteger(targetId)) {
    next(new AppError('Invalid id', 400))
    return
  }

  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    next(new AppError('Forbidden', 403, 'FORBIDDEN'))
    return
  }
  next()
}
