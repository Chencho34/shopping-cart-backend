import { Request, Response } from 'express'

import { CreateUserDto, LoginUserDto } from '../dtos/user.dto'

import { AuthService } from '../services/auth.service'
import { generateAccessToken } from '../services/token.service'

import { catchAsync } from '../utils'

export class AuthController {  
  static signup = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body
    const user = await AuthService.signup(userData)

    return res.status(201).json({
      success: true,
      message: 'User created successfully', 
      data: { user }
    })
  })

  static login = catchAsync(async (req: Request, res: Response) => {
    const data: LoginUserDto = req.body
    const user = await AuthService.login(data)    
    const token = generateAccessToken(user, res)

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
    res.clearCookie('token')
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
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
