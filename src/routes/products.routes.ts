import { Router } from 'express'
import { ProdutsController } from '../controllers/products.controller'

const router = Router()

router.get('/products', ProdutsController.getAll)
router.get('/products/product/:id', ProdutsController.getById)
router.post('/products/create-new-product', ProdutsController.createNew)
router.delete('/products/delete-product/:id', ProdutsController.deleteById)
router.put('/products/update-product', ProdutsController.update)

export default router
