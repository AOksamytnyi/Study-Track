import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { login, register } from "../controllers/auth.controller";

const authRouter = Router()

authRouter.post('/register', asyncHandler(register))
authRouter.post('/login', asyncHandler(login))

export default authRouter
