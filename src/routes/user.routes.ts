import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { validate } from '../middlewares/validate'
import { userSchema } from '../schemas/auth.schema'

const router = Router()

router.post('/users/register', validate(userSchema), UserController.register)
router.post('/users/login', UserController.login)
router.get('/users', UserController.getAllUsers)
router.get('/users/:id', UserController.getById)

export default router
