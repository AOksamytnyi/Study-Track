import prisma from "../lib/prisma";
import { Request, Response } from "express";

export async function createSession(req: Request, res: Response) {
  const { title, description, date, duration, difficulty } = req.body;

  if (!title || !description || !date || !duration || !difficulty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const session = await prisma.studySession.create({
    data: {
      title,
      description,
      date,
      duration,
      difficulty,
      userId: req.userId,
    },
  });

  return res.status(201).json(session);
}

export async function getSessions(req: Request, res: Response) {
  const sessions = await prisma.studySession.findMany({
    where: { userId: req.userId },
  });

  return res.json(sessions);
}

export async function updateSession(req: Request, res: Response) {
  const id = req.params.id;
  const sessionId = parseInt(id as string);

  if (isNaN(sessionId)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const { title, description, date, duration, difficulty } = req.body;

  if (!title || !description || !date || !duration || !difficulty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ message: "Session not found" });
  }

  const updatedSession = await prisma.studySession.update({
    where: { id: sessionId },
    data: { title, description, date, duration, difficulty },
  });

  return res.json(updatedSession);
}

export async function deleteSession(req: Request, res: Response) {
  const id = req.params.id;

  const sessionId = parseInt(id as string);

  if (isNaN(sessionId)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ message: "Session not found" });
  }

 await prisma.studySession.delete({where: {id: sessionId}})

  return res.status(200).json({
    message: `session ${session.title} deleted`,
  })
}
