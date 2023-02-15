import superjson from 'superjson'
import { type inferAsyncReturnType, initTRPC } from '@trpc/server'
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
    meta: {}
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  }
})

export const router = t.router
export const publicProcedure = t.procedure

const helloRouter = router({
  greeting: publicProcedure.query(({ ctx }) => {
    return 'Hello world'
  })
})

export const appRouter = router({
  hello: helloRouter
})

export type AppRouter = typeof appRouter
