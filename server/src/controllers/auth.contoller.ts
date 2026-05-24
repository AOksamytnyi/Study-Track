import prisma from "../lib/prisma";
import { Request, Response } from 'express'

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existing = await prisma.user.findUnique({where: {email}})
  if(existing){
    return res.status(409).json({message: "User already exists"})
  }

  const user = await prisma.user.create({
    data: {email: email, passwordHash: password, username: username}
  })

  return res.status(201).json({ user })

}
