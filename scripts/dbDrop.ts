import { Client } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function dropDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    console.log('Dropping database schema...')
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })

    await client.connect()
    
    await client.query('DROP SCHEMA public CASCADE')
    await client.query('CREATE SCHEMA public')
    
    await client.end()
    console.log('Database schema drop complete!')
    
  } catch (error) {
    console.error('Error during drop:', error)
    process.exit(1)
  }
}

dropDatabase()
