import { Request, Response } from 'express'
import { CartService } from '../services/cart.service'

export class CartController {
  static async addToCart (req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      // const userId = 2
      // const userId = 1

      const { productId, quantity } = req.body

      const cartItem = await CartService.addToCart(userId, productId, quantity)
      res.status(201).json({
        succes: true,
        data: cartItem
      })
    } catch (error: unknown) {
      console.log(error)
    }
  }

  static async getCart (req: Request, res: Response){
    try {
      const userId = (req as any).user.id
      // const userId = 1
      const cartItems = await CartService.getCart(userId)
      res.status(200).json({
        succes: true,
        data: cartItems
      })
    } catch (error) {
      console.log(error)
    }
  }
}
