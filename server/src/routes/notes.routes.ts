import { Router } from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/notes.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const notesRouter = Router();

notesRouter.use(authMiddleware);

notesRouter.get("/", asyncHandler(getNotes));
notesRouter.post("/", asyncHandler(createNote));
notesRouter.patch("/:id", asyncHandler(updateNote));
notesRouter.delete("/:id", asyncHandler(deleteNote));

export default notesRouter;
