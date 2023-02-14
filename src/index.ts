import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'

import cors from 'cors'
import helmet from 'helmet'

import { appRouter, createContext } from './trpc'
import { environment } from './environment'

const app = express()

app.use(express.json({ limit: '300kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(helmet())

app.get('/', (req, res) => res.send('Hello'))
app.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }))

app.listen(environment.SERVER_PORT, () => {
  console.log(`🚀 Server is up and running on port ${environment.SERVER_PORT}`)
})
