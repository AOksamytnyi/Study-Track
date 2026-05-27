import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { createSession } from '../controllers/sessions.contoller'
import { asyncHandler } from '../utils/async-handler'

const router = Router()

router.use(authMiddleware) // применится ко всем роутам ниже

router.post('/', asyncHandler(createSession))

export default router