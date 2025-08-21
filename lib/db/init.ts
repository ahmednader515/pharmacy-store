import { connectToDatabase } from './index'

/**
 * Initialize database connection when the application starts
 * This should be called once during app startup
 */
export async function initializeDatabase() {
  console.log('🚀 Initializing database connection...')
  
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      console.log('⚠️  Database connection failed, using mock data mode')
      return false
    }
    
    console.log('✅ Database initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return false
  }
}

/**
 * Check if database is ready
 */
export function isDatabaseReady() {
  return !require('./index').isUsingMockData()
}
