import { UpdateUserDto } from '../dtos/user.dto'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'

export class UserService {

  static async getAllUsers (): Promise<User[]> {
    return await User.findAll({ attributes: { exclude: ['password'] } })
  }

  static async getUserById (id: number): Promise<User | null> {
    const user = await User.findByPk(id, { attributes: {exclude: ['password'] } })
    return user
  }

  static async updateUser ( id: number, userData: UpdateUserDto) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }
    await User.update(userData, { where: { id } })
    return User.findByPk(id, { attributes: { exclude: ['password'] } }) 
  }

  static deleteUser (id: number): Promise<number> {
    return User.destroy({ where: { id }})
  }
}
