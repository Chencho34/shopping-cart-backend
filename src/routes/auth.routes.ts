import { Router } from 'express'

import { AuthController } from '../controllers/auth.controller'
import { loginSchema, signupSchema } from '../schemas/auth.schema'

import { validate } from '../middlewares/validate'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

router.post('/auth/signup', validate(signupSchema), AuthController.signup)
router.post('/auth/login', validate(loginSchema), AuthController.login)
router.post('/auth/logout', AuthController.logout)
router.get('/auth/me', authenticate, AuthController.me)
router.get('/auth/refresh', AuthController.refresh)

export default router
