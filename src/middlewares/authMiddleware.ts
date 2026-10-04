import { NextFunction, Request, Response} from 'express'
import { AppError } from '../utils'
import { verifyAccessToken } from '../services/token.service'

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization

  if(!header?.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401))
    return
  }

  const token = header.slice(7)
  const secret = process.env.JWT_SECRET
  
  if(!secret){
    next(new AppError('JWT_SECRET is not defined', 500))
    return
  }

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    next(new AppError('Invalid token', 401))
  }
}

export const authorize = (...roles: Array<'user' | 'admin'>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Unauthorized', 401))
      return
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403))
      return
    }
    next()
  }
}

export const requireSelfOrAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(new AppError('Unauthorized', 401))
    return
  }

  const targetId = Number(req.params.id)

  if (!Number.isInteger(targetId)) {
    next(new AppError('Invalid id', 400))
    return
  }

  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    next(new AppError('Forbidden', 403))
    return
  }
  next()
}
