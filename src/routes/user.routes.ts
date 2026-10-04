import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticate, authorize, requireSelfOrAdmin } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validate'
import { updateUserSelfSchema } from '../schemas/user.schema'

const router = Router()

router.get('/users', authenticate, authorize('admin'), UserController.getAll)
router.get('/user/:id', authenticate, requireSelfOrAdmin, UserController.getById)
router.delete('/user/:id', authenticate, requireSelfOrAdmin, UserController.deleteById)
router.put('/user/:id', authenticate, requireSelfOrAdmin, validate(updateUserSelfSchema), UserController.update)

export default router
