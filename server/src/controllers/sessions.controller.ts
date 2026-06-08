import prisma from "../lib/prisma";
import { Request, Response } from "express";
import {
  createSessionSchema,
  tagSchema,
  updateSessionSchema,
} from "../schemas/session.schema";

export async function createSession(req: Request, res: Response) {
  const result = createSessionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const { title, description, date, duration, difficulty } = result.data;

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
    include: {
      sessionTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return res.json(sessions);
}

export async function updateSession(req: Request, res: Response) {
  const id = req.params.id;
  const sessionId = parseInt(id as string);

  if (isNaN(sessionId)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = updateSessionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const { title, description, date, duration, difficulty } = result.data;


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

  await prisma.sessionTag.deleteMany({
    where: { studySessionId: sessionId },
  });

  await prisma.note.deleteMany({
    where: { studySessionId: sessionId },
  });

  await prisma.studySession.delete({ where: { id: sessionId } });

  return res.status(200).json({
    message: `session ${session.title} deleted`,
  });
}

export async function createSessionTag(req: Request, res: Response) {
  const sessionId = parseInt(req.params.id as string);

  if (isNaN(sessionId)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = tagSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ message: "Session not found" });
  }

  const tag = await prisma.$transaction(async (tx) => {
    const createdTag = await tx.tag.create({
      data: {
        name: result.data.name,
        userId: req.userId,
      },
    });

    await tx.sessionTag.create({
      data: {
        studySessionId: sessionId,
        tagId: createdTag.id,
      },
    });

    return createdTag;
  });

  return res.status(201).json(tag);
}

export async function deleteSessionTag(req: Request, res: Response) {
  const sessionId = parseInt(req.params.id as string);
  const tagId = parseInt(req.params.tagId as string);

  if (isNaN(sessionId) || isNaN(tagId)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ message: "Session not found" });
  }

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  if (!tag || tag.userId !== req.userId) {
    return res.status(404).json({ message: "Tag not found" });
  }

  const sessionTag = await prisma.sessionTag.findUnique({
    where: {
      studySessionId_tagId: {
        studySessionId: sessionId,
        tagId,
      },
    },
  });

  if (!sessionTag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.sessionTag.delete({
      where: {
        studySessionId_tagId: {
          studySessionId: sessionId,
          tagId,
        },
      },
    });

    const remainingTagLinks = await tx.sessionTag.count({
      where: { tagId },
    });

    if (remainingTagLinks === 0) {
      await tx.tag.delete({
        where: { id: tagId },
      });
    }
  });

  return res.status(204).send();
}
