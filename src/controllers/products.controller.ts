import { Request, Response } from 'express'
import Product from '../models/product.model'

export class ProdutsController {

  static async createNew (req: Request, res: Response) {
    try {
      const producto = req.body
      const newProduct = await Product.create(producto)
      return res.status(201).json({message: 'creato', newProduct})
    } catch (error) {
      return res.status(400).json({message: 'no se creo producto'})
    }
  }
 
  static async getAll (_req: Request, res: Response) {
    try {
      const products = await Product.findAll()
      return res.status(201).json({products})
    } catch (error) {
      return error 
    }
  }

  static async getById () {

  }

  static async update () {
    try {
      
    } catch (error) {
      
    }
  }

  static async deleteById () {
    try {
      
    } catch (error) {
      
    }
  }
}
