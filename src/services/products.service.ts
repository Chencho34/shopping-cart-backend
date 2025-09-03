import { ProductAttributes } from '../dtos/product.dto'
import Product from '../models/product.model'

export class ProductService {
  static async createNew (productData: ProductAttributes): Promise<Product> {
    const newProduct = await Product.create(productData)
    return newProduct
  }

  static async getAll (): Promise<Product[]> {
    const allProducts = await Product.findAll()
    return allProducts
  }

  static async getById (id: number): Promise<Product | null> {
    const product = await Product.findByPk(id)
    return product
  }

  static async update (id: number, productData: ProductAttributes): Promise<Product | null> {
    await Product.update(productData, { where: { id }})
    return Product.findByPk(id)
  }

  static async deleteById (id: number): Promise<number> {
    const product = await Product.destroy({where: { id }})
    return product
  }
}
