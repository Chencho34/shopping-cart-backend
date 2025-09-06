import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middlewares/validate'
import { loginSchema, signupSchema } from '../schemas/auth.schema'

const router = Router()

router.post('/auth/register', validate(signupSchema), AuthController.signup)
router.post('/auth/login', validate(loginSchema), AuthController.login)

export default router
