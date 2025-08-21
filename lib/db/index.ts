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
  // If no DATABASE_URL, return mock connection
  if (!DATABASE_URL) {
    console.warn('DATABASE_URL is missing, using mock data mode')
    return { isMock: true }
  }

  try {
    // Use the single Prisma instance - no need for complex connection management
    // Prisma handles connection pooling internally
    return { prisma, isMock: false }
  } catch (error) {
    console.warn('❌ Failed to connect to PostgreSQL, using mock data mode:', error)
    return { isMock: true }
  }
}

export const clearDatabaseCache = () => {
  console.log('🔄 Database cache cleared (Prisma handles connection pooling)')
}

export const forceRefreshDatabaseConnection = () => {
  console.log('🔄 Force refreshing database connection...')
  return connectToDatabase()
}

export const isUsingMockData = () => {
  return !process.env.DATABASE_URL
}

export const closeGlobalPrisma = async () => {
  console.log('🔌 Closing Prisma client...')
  await prisma.$disconnect()
}

// Export initialization functions
export { initializeDatabase } from './init'
