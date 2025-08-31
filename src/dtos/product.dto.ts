export interface ProductAttributes {
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
