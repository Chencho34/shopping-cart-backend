import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { generateAccessToken, generateRefreshToken } from '../services/token.service'
import { catchAsync } from '../utils'

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
    const token = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user, token)

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: (1000 * 60 * 60 * 24) * 7
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    })
  })

  static logout = catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie('jwt')
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  })


  // TODO: Implement refresh token functionality
  static refresh = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies['REFRESH_COOKIE'] as string | undefined

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
      })
    }
 
    return res.json(req.cookies)
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
