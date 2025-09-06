import Cart from '../models/cart.model'
import Product from '../models/product.model'
import { AppError } from '../utils'

export class CartService {
  static async addToCart (userId: number, productId: number, quantity: number = 1) {
    const product = await Product.findByPk(productId)
    if (!product) throw new AppError('product not found', 404)
    return await Cart.create({
      userId,
      productId,
      quantity
    })
  }

  static async getCart (userId: number){
    return await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price']
        }
      ]
    }
    )
  }
}
