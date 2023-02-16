import { router } from '../lib/trpc'
import { helloRouter } from './hello-router'

export const rootRouter = router({
  hello: helloRouter
})

export type RootRouter = typeof rootRouter
