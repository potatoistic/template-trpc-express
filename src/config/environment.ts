import { z } from 'zod'
import { config } from 'dotenv'
import { join } from 'path'

config({ path: join(__dirname, '../.env') })

const server = z.object({
  NODE_ENV: z.enum(['development', 'stage', 'production']),
  SERVER_PORT: z.preprocess((val) => Number(val), z.number())
})

const processEnv: Record<keyof z.infer<typeof server>, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  SERVER_PORT: process.env.SERVER_PORT
}

const parsed = server.safeParse(processEnv)

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors
  )
  throw new Error('Invalid environment variables')
}

const env = new Proxy(parsed.data, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined

    return target[prop as keyof typeof target]
  }
})

export const environment =
  process.env.SKIP_VALIDATION === 'true' ? process.env : env
