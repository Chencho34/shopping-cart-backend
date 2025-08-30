import { Router } from 'express'
import { ProdutsController } from '../controllers/products.controller'

const router = Router()

router.post('/products/create-new-product', ProdutsController.createNew)
router.get('/products', ProdutsController.getAll)
router.put('/products/update-product', ProdutsController.update)
router.delete('/products/delete-product/:id', ProdutsController.deleteById)
router.get('products/product/:id', ProdutsController.getById)

export default router
