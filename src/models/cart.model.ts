import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/db'
import User from './user.model'
import Product from './product.model'

interface CartAttributes {
  id: number
  userId: number
  productId: number
  quantity: number
  createdAt?: Date
  updateAt?: Date
}

export interface CartCreationAttributes extends Optional<CartAttributes, 'id'>{}

export default class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  id!: number
  userId!: number
  productId!: number
  quantity!: number
  createdAt!: Date
  updateAt!: Date
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    }
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts'
  }
)


Cart.belongsTo(User, { foreignKey: 'userId' })
Cart.belongsTo(Product, { foreignKey: 'productId' })
User.hasMany(Cart, { foreignKey: 'userId' })
Product.hasMany(Cart, { foreignKey: 'productId' })
export { Cart }
