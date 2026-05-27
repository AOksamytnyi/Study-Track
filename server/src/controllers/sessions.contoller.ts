import prisma from "../lib/prisma";
import { Request, Response } from "express";


export async function createSession(req: Request, res: Response) {
  const { title, description, date, duration, difficulty } = req.body

  if (!title || !description || !date || !duration || !difficulty) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const session = await prisma.studySession.create({
    data: {
      title,
      description,
      date,
      duration,
      difficulty,
      userId: req.userId
    }
  })

  return res.status(201).json(session)
}

export async function getSessions(req: Request, res: Response) {
  const sessions = await prisma.studySession.findMany({
    where: { userId: req.userId }
  })

  return res.json(sessions)
}