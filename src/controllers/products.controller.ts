import { Request, Response } from 'express'
import { ProductAttributes } from '../dtos/product.dto'
import { ProductService } from '../services/products.service'
import { catchAsync, AppError } from '../utils'

export class ProdutsController {

  static createNew = catchAsync(async (req: Request, res: Response) => {
    const productoData: ProductAttributes = req.body
    const newProduct = await ProductService.createNew(productoData)
    return res.status(201).json({
      succes: true,
      message: 'Product created successfully.',
      newProduct
    })
  })
 
  static getAll = catchAsync(async (_req: Request, res: Response) => {
    const products: ProductAttributes[] = await ProductService.getAll()
    return res.status(201).json({
      succes: true,
      products
    })
  })

  static getById = catchAsync(async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id)
    const product = await ProductService.getById(productId)
    if (!product) throw new AppError('Product not found.', 404)
    return res.status(201).json({
      succes: true,
      product
    })
  })

  static update = catchAsync(async (req: Request, res: Response) => {
    const newProductData: ProductAttributes = req.body
    const { id } = newProductData 
    const product = await ProductService.update(id, newProductData)
    if(!product) throw new AppError('Product not found.', 404)
    return res.status(201).json({
      succes: true,
      message: 'Product updated successfully.',
      product
    })
  })

  static deleteById = catchAsync(async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id)
    const productToDelete = await ProductService.deleteById(productId)
    if(!productToDelete) throw new AppError('Product not found.', 404)
    return res.status(201).json({
      succes: true,
      message: 'Product delete successfully.'
    })    
  })
}
