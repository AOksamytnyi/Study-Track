import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { createNoteSchema, updateNoteSchema } from "../schemas/note.schema";

function getNumericParam(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}

export async function getNotes(req: Request, res: Response) {
  const sessionId = getNumericParam(req.query.sessionId as string | undefined);

  const notes = await prisma.note.findMany({
    where: {
      studySession: {
        userId: req.userId,
        ...(sessionId ? { id: sessionId } : {}),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(notes);
}

export async function createNote(req: Request, res: Response) {
  const result = createNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const session = await prisma.studySession.findUnique({
    where: { id: result.data.studySessionId },
  });

  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ message: "Session not found" });
  }

  const note = await prisma.note.create({
    data: result.data,
  });

  return res.status(201).json(note);
}

export async function updateNote(req: Request, res: Response) {
  const noteId = getNumericParam(req.params.id);

  if (noteId === null) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = updateNoteSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { studySession: true },
  });

  if (!note || note.studySession.userId !== req.userId) {
    return res.status(404).json({ message: "Note not found" });
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: result.data,
  });

  return res.json(updatedNote);
}

export async function deleteNote(req: Request, res: Response) {
  const noteId = getNumericParam(req.params.id);

  if (noteId === null) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: { studySession: true },
  });

  if (!note || note.studySession.userId !== req.userId) {
    return res.status(404).json({ message: "Note not found" });
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  return res.status(204).send();
}
