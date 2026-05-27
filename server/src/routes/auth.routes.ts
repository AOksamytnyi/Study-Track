import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { login, register } from "../controllers/auth.contoller";

export const authRouter = Router()

authRouter.post('/register', asyncHandler(register))
authRouter.post('/login', asyncHandler(login))
