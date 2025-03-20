import { env } from '@/env'
import { schema } from '@/infra/db/schemas'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const pg = postgres(env.DATABASE_URL)
export const db = drizzle(pg, { schema })
