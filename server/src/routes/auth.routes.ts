import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { getCurrentUser, login, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const authRouter = Router()

authRouter.post('/register', asyncHandler(register))
authRouter.post('/login', asyncHandler(login))
authRouter.get('/me', authMiddleware, asyncHandler(getCurrentUser))

export default authRouter
