import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { createSession, getSessions, updateSession } from '../controllers/sessions.contoller'
import { asyncHandler } from '../utils/async-handler'

const router = Router()

router.use(authMiddleware) // применится ко всем роутам ниже

router.post('/', asyncHandler(createSession))
router.get('/', asyncHandler(getSessions))
router.patch('/:id', asyncHandler(updateSession))

export default router