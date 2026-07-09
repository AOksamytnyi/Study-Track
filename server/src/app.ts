import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import sessionsRouter from './routes/sessions.routes'
import notesRouter from './routes/notes.routes'
import { errorMiddleware } from './middleware/error.middleware'
import { env } from './config/env'


export const app = express()

app.use(cors({
    origin: env.CLIENT_URL ?? true,
}))
app.use(express.json())

app.use('/auth', authRouter)
app.use('/sessions', sessionsRouter)
app.use('/notes', notesRouter)

app.use(errorMiddleware)
