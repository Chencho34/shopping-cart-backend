import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/token.service'
import { catchAsync } from '../utils'
import { ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, clearAccessCookieOptions, clearRefreshCookieOptions, refreshCookieOptions } from '../config/cookies'
import { randomUUID } from 'crypto'

export class AuthController {  
  static signup = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.signup(req.body)

    return res.status(201).json({
      success: true,
      message: 'User created successfully', 
      data: { user }
    })
  })

  static login = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.login(req.body)
    const accessToken = generateAccessToken(user)
    const tokenId = randomUUID()
    const refreshToken = generateRefreshToken(user.id, tokenId)

    res.cookie(ACCESS_COOKIE, accessToken, accessCookieOptions())
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions())

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken
      }
    })
  })

  static logout = catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie(ACCESS_COOKIE, clearAccessCookieOptions())
    res.clearCookie(REFRESH_COOKIE, clearRefreshCookieOptions())
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  })


  // TODO: Implement refresh token functionality
  static refresh = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE]
    const { id } = verifyRefreshToken(refreshToken)
    const user = await AuthService.me(id)
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
      })
    }
 
    return res.json({ refreshToken, user})
  })

  static me = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.me(req.user!.id)

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    })
  })
}
