import jwt from 'jsonwebtoken'
import { AppError } from '../utils'

export interface AccessTokenPayload {
  id: number
  email: string
  role: 'user' | 'admin'
}

function getEnvOrThrow (key: string): string {
  const value = process.env[key]
  if (!value) throw new AppError(`${key} is not defined`, 500)
  return value
}

const JWT_SECRET = getEnvOrThrow('JWT_SECRET')
const JWT_REFRESH_SECRET = getEnvOrThrow('JWT_REFRESH_SECRET')


export function generateAccessToken (payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',  //! PENDIENTE
    expiresIn: '15m'
  })  
}

export function verifyAccessToken (token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET, {algorithms: ['HS256']}) //! PENDIENTE

  if (typeof decoded === 'string' || decoded.id == null || decoded.email == null || decoded.role == null) {
    throw new AppError('Invalid Token', 401)
  }

  return { 
    id: decoded.id, 
    email: decoded.email, 
    role: decoded.role
  }
}

export function generateRefreshToken (payload: AccessTokenPayload , tokenId: string): string {
  return jwt.sign({payload, tokenId}, JWT_REFRESH_SECRET, { expiresIn: '7d', algorithm: 'HS256'}) //! PENDIENTE
}
