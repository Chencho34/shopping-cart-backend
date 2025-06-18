import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/db'

export default class User extends Model {
  id!: number
  username!: string
  email!: string
  password!: string
  createdAt!: Date
  updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  }
)
