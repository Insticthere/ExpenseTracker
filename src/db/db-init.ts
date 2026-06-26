// src/db.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle({ client })