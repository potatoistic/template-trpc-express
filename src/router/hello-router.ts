import { publicProcedure, router } from '../lib/trpc'

export const helloRouter = router({
  greetings: publicProcedure.query(({ ctx }) => {
    return 'Hello world'
  })
})
