import { Router } from 'express'
import { CartController } from '../controllers/cart.controller'

const router = Router()

router.post('/cart/add-to-cart', CartController.addToCart)
router.get('/cart', CartController.getCart)

export default router
