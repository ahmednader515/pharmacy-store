import { PrismaClient } from '@prisma/client'

const cached: { conn: any; promise: any } = { conn: null, promise: null }

export const connectToDatabase = async (
  DATABASE_URL = process.env.DATABASE_URL
) => {
  // Return cached connection immediately if available
  if (cached.conn) return cached.conn

  if (!DATABASE_URL) {
    console.warn('DATABASE_URL is missing, using mock data mode')
    // Return a mock connection object
    cached.conn = { isMock: true }
    return cached.conn
  }

  // If we're already trying to connect, wait for that promise
  if (cached.promise) {
    try {
      return await cached.promise
    } catch (error) {
      // If the previous connection attempt failed, clear it and try again
      cached.promise = null
      cached.conn = null
    }
  }

  // Create connection promise
  cached.promise = (async () => {
    try {
      // Create a new Prisma client instance with connection pooling
      const prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: DATABASE_URL,
          },
        },
        // Add connection pooling configuration
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
      
      // Test the connection with a shorter timeout for faster fallback
      const connectionPromise = prismaClient.$connect()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 2000) // Reduced from 5000ms to 2000ms
      )
      
      await Promise.race([connectionPromise, timeoutPromise])
      const connection = { prisma: prismaClient, isMock: false }
      cached.conn = connection
      cached.promise = null
      return connection
    } catch (error) {
      console.warn('Failed to connect to PostgreSQL, using mock data mode:', error)
      // Return a mock connection object
      const mockConnection = { isMock: true }
      cached.conn = mockConnection
      cached.promise = null
      return mockConnection
    }
  })()

  return await cached.promise
}

export const clearDatabaseCache = () => {
  if (cached.conn && !cached.conn.isMock && cached.conn.prisma) {
    cached.conn.prisma.$disconnect()
  }
  cached.conn = null
  cached.promise = null
}
