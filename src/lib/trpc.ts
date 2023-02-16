import { z } from 'zod'
import JWT from 'jsonwebtoken'
import superjson from 'superjson'
import { type inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server'
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
    session: { user: null }
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

const enforceUserIsauthenticated = t.middleware(({ ctx, next }) => {
  const token = ctx.req.headers['x-session-id']
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  try {
    const parsedToken = z.string().parse(token)
    const decoded = JWT.verify(
      parsedToken,
      'some-secret-token'
    ) as JWT.JwtPayload

    return next({
      ctx: {
        session: { ...ctx.session, user: decoded }
      }
    })
  } catch (e: any) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
})

export const protectedProcedure = t.procedure.use(enforceUserIsauthenticated)
