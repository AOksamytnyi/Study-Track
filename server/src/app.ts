import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import sessionsRouter from './routes/sessions.routes'
import { errorMiddleware } from './middleware/error.middleware'


export const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/sessions', sessionsRouter)

app.use(errorMiddleware)

