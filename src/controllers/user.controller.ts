import { Request, Response } from 'express'
import { CreateUserDto } from '../dtos/user.dto'
import { UserService } from '../services/user.service'

export class UserController {
  static async register (req: Request, res: Response) {
    try {
      const data: CreateUserDto = req.body
      const user = await UserService.createUser(data)
      res.status(201).json({ message: 'User created successfully', user })
    } catch (err: any) {
      res.status(400).json({ error: err })
    }
  }

  static async getAllUsers (_req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers()
      res.status(200).json(users)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  } 
}
