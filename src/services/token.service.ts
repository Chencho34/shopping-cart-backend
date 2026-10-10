import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../utils'

export interface AccessTokenPayload {
  id: number
  email: string
  role: 'user' | 'admin'
}

export interface RefreshTokenPayload {
  id: number,
  tokenId: string
}

export function generateAccessToken (payload: AccessTokenPayload): string {
  return jwt.sign(
    { id: payload.id, email: payload.email, role: payload.role},
    env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '15m' }
  )  
}

export function verifyAccessToken (token: string): AccessTokenPayload {
  let decoded: string | jwt.JwtPayload

  try {
    decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256']})
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401, 'TOKEN_EXPIRED')
    }
     throw new AppError('Invalid token', 401, 'INVALID_TOKEN')
  }

  if (typeof decoded === 'string' || decoded.id == null || decoded.email == null || decoded.role == null) {
    throw new AppError('Invalid Token', 401, 'INVALID_TOKEN')
  }

  return { 
    id: decoded.id, 
    email: decoded.email, 
    role: decoded.role
  }
}

export function generateRefreshToken (userId: number, tokenId: string): string {
  return jwt.sign(
    { id: userId, tokenId},
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'HS256'}
  )
}

export function verifyRefreshToken (token: string): RefreshTokenPayload {
  let decoded: string | jwt.JwtPayload

  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Invalid token', 401, 'TOKEN_EXPIRED')
    }
    throw new AppError('Invalid token', 401, 'INVALID_TOKEN')
  }

  if (typeof decoded === 'string' || decoded.id == null || decoded.tokenId == null) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN')
  }

  return { id: decoded.id, tokenId: decoded.tokenId }
}
