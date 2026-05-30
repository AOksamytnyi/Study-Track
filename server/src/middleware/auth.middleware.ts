import { Request, Response, NextFunction } from 'express'

const jwt = require("jsonwebtoken");

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization 

  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as { userId: number }
    req.userId = payload.userId
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}