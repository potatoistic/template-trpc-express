import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'

import cors from 'cors'
import helmet from 'helmet'

import { appRouter, createContext } from './lib/trpc'

const app = express()

app.use(express.json({ limit: '300kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(helmet())

app.get('/', (req, res) => res.send({ message: 'Hello World from TRPC' }))
app.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }))

export { app }
