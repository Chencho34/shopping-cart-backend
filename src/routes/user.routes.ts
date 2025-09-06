import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()

router.get('/users', UserController.getAll)
router.get('/users/user/:id', UserController.getById)
router.delete('/users/delete-user/:id', UserController.deleteById)
// router.put('/users/update-user', UserController.update)

export default router
