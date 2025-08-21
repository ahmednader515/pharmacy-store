import { PrismaClient } from '@prisma/client'

// Extend globalThis for better TypeScript support
declare const globalThis: {
  prismaGlobal: PrismaClient | undefined
} & typeof global

// Single source of truth for database connection
const prisma = globalThis.prismaGlobal ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

// In development, store in globalThis to survive hot reloads
if (process.env.NODE_ENV === 'development') {
  globalThis.prismaGlobal = prisma
}

export const connectToDatabase = async (
  DATABASE_URL = process.env.DATABASE_URL
) => {
  console.log('🔌 Attempting database connection...')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('DATABASE_URL exists:', !!DATABASE_URL)
  
  // If no DATABASE_URL, return mock connection
  if (!DATABASE_URL) {
    console.log('📝 No DATABASE_URL found, using mock data mode')
    return { isMock: true, prisma: null }
  }

  try {
    console.log('🔍 Testing database connection...')
    // Test the connection by running a simple query
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    return { prisma, isMock: false }
  } catch (error) {
    console.warn('❌ Failed to connect to PostgreSQL, using mock data mode:', error)
    
    // In production, we might want to be more strict about database connections
    if (process.env.NODE_ENV === 'production') {
      console.error('Production database connection failed. Check your DATABASE_URL and database status.')
    }
    
    return { isMock: true, prisma: null }
  }
}

export const clearDatabaseCache = () => {
  console.log('🔄 Database cache cleared (Prisma handles connection pooling)')
}

export const forceRefreshDatabaseConnection = async () => {
  console.log('🔄 Force refreshing database connection...')
  try {
    await prisma.$disconnect()
    return connectToDatabase()
  } catch (error) {
    console.error('Failed to refresh database connection:', error)
    return { isMock: true, prisma: null }
  }
}

export const isUsingMockData = () => {
  return !process.env.DATABASE_URL
}

export const closeGlobalPrisma = async () => {
  console.log('🔌 Closing Prisma client...')
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error closing Prisma client:', error)
  }
}

// Export initialization functions
export { initializeDatabase } from './init'
