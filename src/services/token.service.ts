import jwt from 'jsonwebtoken'
import { AppError } from '../utils'
import { Response } from 'express'

function getEnvOrThrow (key: string): string {
  const value = process.env[key]
  if (!value) throw new AppError(`${key} is not defined`, 500)
  return value
}

const JWT_SECRET = getEnvOrThrow('JWT_SECRET')
const JWT_REFRESH_SECRET = getEnvOrThrow('JWT_REFRESH_SECRET')

export function generateAccessToken (user: Object, res: Response): string {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '15m'})

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: (1000 * 60 * 60 * 24) * 7
  })
  
  return token
}

export function generateRefreshToken (user: Object, tokenId: string): string {
  return jwt.sign({user, tokenId}, JWT_REFRESH_SECRET, { expiresIn: '7d'})
}
