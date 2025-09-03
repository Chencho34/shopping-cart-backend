import { Request, Response } from 'express'
import { CreateUserDto, LoginUserDto } from '../dtos/user.dto'
import { catchAsync } from '../utils'
import { AuthService } from '../services/auth.service'

export class AuthController {
  
  static signup = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body
    const user = await AuthService.signup(userData)
    return res.status(201).json({ 
      message: 'User created successfully', 
      user 
    })
  })

  static login = catchAsync(async (req: Request, res: Response) => {
    const data: LoginUserDto = req.body
    const result = await AuthService.login(data)
    if (!result) {
      res.status(401).json({ error: 'Invalid credentials controller' })
    }
    res.json(result)
  })
}
