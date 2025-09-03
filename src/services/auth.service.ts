import { Op } from 'sequelize'
import { CreateUserDto, LoginUserDto } from '../dtos/user.dto'
import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class AuthService {
   static async signup (userData: CreateUserDto): Promise<User> {
    const existsUser = await User.findOne({
      where: {
        [Op.or]: [{ username: userData.username }, { email: userData.email }]
      }
    })

    if (existsUser) {
      const conflictField = existsUser.email === userData.email ? 'email' : 'username'
      const error: any = new Error(`El ${conflictField} ya está en uso`)
      error.code = `${conflictField.toUpperCase()}_EXISTS`
      error.status = 409
      throw error
    }
            
    const hashed = await bcrypt.hash(userData.password, 10)
    const user = await User.create({ ...userData, password: hashed })
    return user
  }

  static async login (data: LoginUserDto) {
    const user = await User.findOne({ where: { email: data.email}})
    if (!user) {
      throw new Error('User not found')
    }
    const isMatch = await bcrypt.compare(data.password, user.password)
    
    // const valid = data.password === user.password

    // if (!valid) {
    //   throw new Error('Invalid credentials')
    // }

    if (!isMatch) {
      throw new Error('Invalid credentials services')
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  }
}
