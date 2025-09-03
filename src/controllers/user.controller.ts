import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { catchAsync } from '../utils'

export class UserController {

  static getAll = catchAsync(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers()
    return res.status(200).json(users)
  }) 

  static getById = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const user = await UserService.getUserById(userId)
    if (!user) res.status(404).json({ error: 'User not found' })
    return res.status(200).json(user)
  })

  static deleteById = catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    const user = await UserService.deleteUser(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.status(200).json({ error: 'User was delete' })
  })
}
