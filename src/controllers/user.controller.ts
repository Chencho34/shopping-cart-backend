import { Request, Response } from 'express'
import { CreateUserDto, LoginUserDto } from '../dtos/user.dto'
import { UserService } from '../services/user.service'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { Op } from 'sequelize'

export class UserController {
  static async register (req: Request, res: Response) {
    try {
      const userData: CreateUserDto = req.body
      const exists = await User.findOne({
        where: {
          [Op.or]: [{email: userData.email}, {username: userData.username}]
        }
      })

      if (exists) {
        const conflictField = exists.email === userData.email ? 'email' : 'username'
        res.status(409).json({
          message: `${conflictField} in used`,
          errorCode: `${conflictField.toUpperCase()}_EXISTS`
        })
        return
      } 
        
      const hashed = await bcrypt.hash(userData.password, 10)
      const user = await UserService.createUser({ ...userData, password: hashed })
      res.status(201).json({ message: 'User created successfully', user })
    } catch (err: any) {
      res.status(400).json({ error: err })
    }
  }

  static async login (req: Request, res: Response) {
    try {
      const data: LoginUserDto = req.body
      const result = await UserService.login(data)
      if (!result) {
        res.status(401).json({ error: 'Invalid credentials controller' })
      }
      res.json(result)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
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

  static async getById ( req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id)
      const user = await UserService.getUserById(userId)
      if (!user) res.status(404).json({ error: 'User not found' })
      res.status(200).json(user)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
}
