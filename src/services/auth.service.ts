import { Op } from 'sequelize'
import { AuthUserDto, CreateUserDto, LoginUserDto } from '../dtos/user.dto'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import { AppError } from '../utils'

const toAuthUser = (user: User): AuthUserDto => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role
})

export class AuthService {
  static async signup (userData: CreateUserDto): Promise<AuthUserDto> {
    const existsUser = await User.findOne({
      where: {
        [Op.or]: [{ username: userData.username }, { email: userData.email }]
      }
    })

    if (existsUser) {
      const conflictField = existsUser.email === userData.email ? 'email' : 'username'
      throw new AppError(`The ${conflictField} is already in use`, 409)
    }
    
    const hashed = await bcrypt.hash(userData.password, 10)
    const user = await User.create({ ...userData, password: hashed })
    
    return toAuthUser(user)
  }

  static async login (data: LoginUserDto): Promise<AuthUserDto> {
    const user = await User.findOne({ where: { email: data.email } })

    if (!user) throw new AppError('Invalid credentials', 401)

    const isMatch = await bcrypt.compare(data.password, user.password)

    if (!isMatch) throw new AppError('Incorrect password.', 401)
      
    return toAuthUser(user)
  }

  static async me (userId: number): Promise<AuthUserDto> {
    const user = await User.findByPk(userId)

    if (!user) throw new AppError('User not found', 404)

    return toAuthUser(user)
  }
}
