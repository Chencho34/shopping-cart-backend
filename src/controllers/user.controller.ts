import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { AppError, catchAsync } from '../utils'

export class UserController {

  static getAll = catchAsync(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers()
    return res.status(200).json(users)
  }) 

  static getById = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const user = await UserService.getUserById(userId)
    if (!user) throw new AppError('User not found', 404)
    return res.status(200).json(user)
  })

  static deleteById = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const user = await UserService.deleteUser(userId)
    if (!user) throw new AppError('User not foud', 404)
    return res.status(200).json({ error: 'User was delete' })
  })
}
