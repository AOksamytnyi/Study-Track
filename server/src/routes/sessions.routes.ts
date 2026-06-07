import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { createSession, createSessionTag, deleteSession, deleteSessionTag, getSessions, updateSession } from '../controllers/sessions.controller'
import { asyncHandler } from '../utils/async-handler'

const sessionsRouter = Router()

sessionsRouter.use(authMiddleware) // применится ко всем роутам ниже

sessionsRouter.post('/', asyncHandler(createSession))
sessionsRouter.get('/', asyncHandler(getSessions))
sessionsRouter.post('/:id/tags', asyncHandler(createSessionTag))
sessionsRouter.delete('/:id/tags/:tagId', asyncHandler(deleteSessionTag))
sessionsRouter.patch('/:id', asyncHandler(updateSession))
sessionsRouter.delete('/:id', asyncHandler(deleteSession))

export default sessionsRouter
