import { Request, Response } from 'express'
import { ProductAttributes } from '../dtos/product.dto'
import { ProductService } from '../services/products.service'

export class ProdutsController {

  static async createNew (req: Request, res: Response) {
    try {
      const productoData: ProductAttributes = req.body
      const newProduct = await ProductService.createNew(productoData)
      return res.status(201).json({
        succes: true,
        message: 'Product created successfully.',
        newProduct
      })
    } catch (error) {
      return res.status(400).json({message: 'no se creo producto', error})
    }
  }
 
  static async getAll (_req: Request, res: Response) {
    try {
      const products: ProductAttributes[] = await ProductService.getAll()
      return res.status(201).json({
        succes: true,
        products
      })
    } catch (error) {
      return error 
    }
  }

  static async getById (req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id)
      const product = await ProductService.getById(productId)
      if (!product) return res.status(404).json({error: 'Product not found'})
      return res.status(201).json({
        succes: true,
        product
      })
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  static async update (req: Request, res: Response) {
    try {
      const newProductData: ProductAttributes = req.body
      const { id } = newProductData 
      const product = await ProductService.update(id, newProductData)
      if(!product) return res.status(401).json({message: 'product not found'})
      return res.status(201).json({
        succes: true,
        message: 'Product created successfully.',
        product
      })
    } catch (error) {
      return res.status(404).json(error)
      
    }
  }

  static async deleteById (req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id)
      const productToDelete = await ProductService.deleteById(productId)
      if(!productToDelete) return res.status(404).json({error: 'Product not found'})
      return res.status(201).json({
        succes: true,
        message: 'Product delete successfully.'
      })
    } catch (error) {
      return res.status(400).json(error)
    }
  }
}
