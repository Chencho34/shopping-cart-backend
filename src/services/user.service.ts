import { CreateUserDto } from '../dtos/user.dto'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'

export class UserService {
  static async createUser (userData: CreateUserDto) {
    // const hashedPassword = await bcrypt.hash(userData.password, 10)
    // const user = await User.create({ ...userData, password: hashedPassword })

    const user = await User.create({ ...userData })
    return user
  }

  static async getAllUsers () {
    return await User.findAll()
    // return await User.findAll({ attributes: { exclude: ['password'] } })
  }
}
