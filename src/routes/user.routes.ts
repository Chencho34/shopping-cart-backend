import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()

router.post('/users/register', UserController.register)
router.get('/users', UserController.getAllUsers)

export default router
