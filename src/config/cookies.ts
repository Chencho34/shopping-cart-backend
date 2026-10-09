import { CookieOptions } from 'express'
import { env } from './env'

export const ACCESS_COOKIE = 'access_token'
export const REFRESH_COOKIE = 'refresh_token'

const baseCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict'
})

export const accessCookieOptions = (): CookieOptions => ({
  ...baseCookieOptions(),
  maxAge: 15 * 60 * 1000,
  path: '/'
})

export const refreshCookieOptions = (): CookieOptions => ({
  ...baseCookieOptions(),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/auth/refresh'
})

export const clearAccessCookieOptions = (): CookieOptions => ({
  ...baseCookieOptions(),
  path: '/'
})

export const clearRefreshCookieOptions = (): CookieOptions => ({
  ...baseCookieOptions(),
  path: '/api/auth/refresh'
})
