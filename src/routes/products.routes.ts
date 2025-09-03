import { Router } from 'express'
import { ProdutsController } from '../controllers/products.controller'
import { validate } from '../middlewares/validate'
import { createProductSchema, updateProductSchema } from '../schemas/product.schema'

const router = Router()

router.get('/products', ProdutsController.getAll)
router.get('/products/product/:id', ProdutsController.getById)
router.post('/products/create-new-product', validate(createProductSchema), ProdutsController.createNew)
router.delete('/products/delete-product/:id', ProdutsController.deleteById)
router.put('/products/update-product',  validate(updateProductSchema), ProdutsController.update)

export default router
