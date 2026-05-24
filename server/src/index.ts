import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './lib/prisma'
import path from 'path'
import { asyncHandler } from './utils/async-handler'
import { register } from './controllers/auth.contoller'
import { authRouter } from './routes/auth.routes'

dotenv.config({ path: path.join(__dirname, '../.env') }) 

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})