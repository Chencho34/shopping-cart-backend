import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/db'

interface ProductAttributes {
  id: number
  name: string
  description: string
  category: 'electronics' | 'gaming' | 'audio' | 'video' | 'smartphones' | 'smart home'
  price: number
  discount?: number
  stock: number
  imageUrl: string 
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'category'> {}

export default class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
    id!: number
    name!: string
    description!: string
    category!: 'electronics' | 'gaming' | 'audio' | 'video' | 'smartphones' | 'smart home'
    price!: number
    discount?: number | undefined
    stock!: number
    imageUrl!: string
    createdAt!: Date
    updatedAt!: Date
  }

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('electronics', 'gaming', 'audio', 'video', 'smartphones', 'smart home'),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    }
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  }
)
