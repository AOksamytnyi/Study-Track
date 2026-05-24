import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { register } from "../controllers/auth.contoller";

export const authRouter = Router()

authRouter.post('/register', asyncHandler(register))