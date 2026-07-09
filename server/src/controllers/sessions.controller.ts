import prisma from "../lib/prisma";
import { Request, Response } from "express";
import {
  createSessionSchema,
  tagSchema,
  updateSessionSchema,
} from "../schemas/session.schema";
import {
  getNumericParam,
  getPositiveIntegerListParam,
  getStringParam,
} from "../utils/params";

const sessionWithTags = {
  sessionTags: {
    include: {
      tag: true,
    },
  },
};

function getDifficultyParam(value: unknown) {
  return value === "easy" || value === "medium" || value === "hard"
    ? value
    : undefined;
}

function getSessionFilters(query: Request["query"]) {
  return {
    search: getStringParam(query.search),
    difficulty: getDifficultyParam(query.difficulty),
    tagIds: getPositiveIntegerListParam(query.tags),
  };
}

function findUserSession(sessionId: number, userId: number) {
  return prisma.studySession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });
}

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
  const { search, difficulty, tagIds } = getSessionFilters(req.query);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId: req.userId,
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(tagIds.length
        ? {
            sessionTags: {
              some: {
                tagId: {
                  in: tagIds,
                },
                tag: {
                  userId: req.userId,
                },
              },
            },
          }
        : {}),
    },
    include: sessionWithTags,
  });

  return res.json(sessions);
}

export async function getSessionTags(req: Request, res: Response) {
  const tags = await prisma.tag.findMany({
    where: { userId: req.userId },
    orderBy: { name: "asc" },
  });

  return res.json(tags);
}

export async function updateSession(req: Request, res: Response) {
  const sessionId = getNumericParam(req.params.id);

  if (sessionId === null) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = updateSessionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const { title, description, date, duration, difficulty } = result.data;

  const session = await findUserSession(sessionId, req.userId);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const updatedSession = await prisma.studySession.update({
    where: { id: sessionId },
    data: { title, description, date, duration, difficulty },
  });

  return res.json(updatedSession);
}

export async function deleteSession(req: Request, res: Response) {
  const sessionId = getNumericParam(req.params.id);

  if (sessionId === null) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const session = await findUserSession(sessionId, req.userId);

  if (!session) {
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
  const sessionId = getNumericParam(req.params.id);

  if (sessionId === null) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const result = tagSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const session = await findUserSession(sessionId, req.userId);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  const tag = await prisma.$transaction(async (tx) => {
    const existingTag = result.data.tagId
      ? await tx.tag.findFirst({
          where: {
            id: result.data.tagId,
            userId: req.userId,
          },
        })
      : await tx.tag.findFirst({
          where: {
            name: result.data.name,
            userId: req.userId,
          },
    });

    if (result.data.tagId && !existingTag) {
      return null;
    }

    const tagToAttach =
      existingTag ??
      (await tx.tag.create({
        data: {
          name: result.data.name!,
          userId: req.userId,
        },
      }));

    await tx.sessionTag.upsert({
      where: {
        studySessionId_tagId: {
          studySessionId: sessionId,
          tagId: tagToAttach.id,
        },
      },
      update: {},
      create: {
        studySessionId: sessionId,
        tagId: tagToAttach.id,
      },
    });

    return tagToAttach;
  });

  if (!tag) {
    return res.status(404).json({ message: "Tag not found" });
  }

  return res.status(201).json(tag);
}

export async function deleteSessionTag(req: Request, res: Response) {
  const sessionId = getNumericParam(req.params.id);
  const tagId = getNumericParam(req.params.tagId);

  if (sessionId === null || tagId === null) {
    return res.status(400).json({ message: "Invalid id" });
  }

  const session = await findUserSession(sessionId, req.userId);

  if (!session) {
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
