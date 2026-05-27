import prisma from "../lib/prisma";
import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

