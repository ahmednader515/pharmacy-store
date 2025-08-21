'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/db'
import { formatError } from '@/lib/utils'

import { WebPageInputSchema, WebPageUpdateSchema } from '../validator'
import { z } from 'zod'

// CREATE
export async function createWebPage(data: z.infer<typeof WebPageInputSchema>) {
  try {
    const connection = await connectToDatabase()
    const webPage = WebPageInputSchema.parse(data)
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot create web page in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    await connection.prisma.webPage.create({
      data: webPage
    })
    revalidatePath('/admin/web-pages')
    return {
      success: true,
      message: 'WebPage created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE
export async function updateWebPage(data: z.infer<typeof WebPageUpdateSchema>) {
  try {
    const connection = await connectToDatabase()
    const webPage = WebPageUpdateSchema.parse(data)
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot update web page in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const { _id, ...updateData } = webPage
    
    await connection.prisma.webPage.update({
      where: { id: _id },
      data: updateData
    })
    revalidatePath('/admin/web-pages')
    return {
      success: true,
      message: 'WebPage updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// DELETE
export async function deleteWebPage(id: string) {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot delete web page in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const res = await connection.prisma.webPage.delete({
      where: { id }
    })
    if (!res) throw new Error('WebPage not found')
    revalidatePath('/admin/web-pages')
    return {
      success: true,
      message: 'WebPage deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ALL
export async function getAllWebPages() {
  const connection = await connectToDatabase()
  if (connection.isMock) {
    console.log('📝 Mock mode: returning mock web page data')
    // Import mock data for web pages
    const { default: data } = await import('@/lib/data')
    const mockWebPages = data.webPages.map((page, index) => ({
      ...page,
      id: `mock-webpage-${index + 1}`,
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Different creation dates
    }))
    return JSON.parse(JSON.stringify(mockWebPages))
  }
  
  if (!connection.prisma) {
    console.warn('Database connection failed in getAllWebPages')
    return []
  }
  
  const webPages = await connection.prisma.webPage.findMany()
  return JSON.parse(JSON.stringify(webPages))
}
export async function getWebPageById(webPageId: string) {
  const connection = await connectToDatabase()
  if (connection.isMock) {
    console.log('📝 Mock mode: returning mock web page by id')
    // Import mock data for web pages
    const { default: data } = await import('@/lib/data')
    const mockWebPageIndex = parseInt(webPageId.replace('mock-webpage-', '')) - 1
    if (mockWebPageIndex >= 0 && mockWebPageIndex < data.webPages.length) {
      const mockWebPage = {
        ...data.webPages[mockWebPageIndex],
        id: webPageId,
        createdAt: new Date(Date.now() - (mockWebPageIndex * 24 * 60 * 60 * 1000)),
      }
      return JSON.parse(JSON.stringify(mockWebPage))
    }
    return null
  }
  
  if (!connection.prisma) {
    console.warn('Database connection failed in getWebPageById')
    return null
  }
  
  const webPage = await connection.prisma.webPage.findUnique({
    where: { id: webPageId }
  })
  return JSON.parse(JSON.stringify(webPage))
}

// GET ONE PAGE BY SLUG
export async function getWebPageBySlug(slug: string) {
  const connection = await connectToDatabase()
  if (connection.isMock) {
    // Import mock data for web pages
    const { default: data } = await import('@/lib/data')
    const mockWebPage = data.webPages.find(page => page.slug === slug && page.isPublished)
    if (!mockWebPage) return null
    return JSON.parse(JSON.stringify(mockWebPage))
  }
  if (!connection.prisma) {
    return null
  }
  
  try {
    const webPage = await connection.prisma.webPage.findFirst({
      where: { slug, isPublished: true }
    })
    if (!webPage) return null
    return JSON.parse(JSON.stringify(webPage))
  } catch (error) {
    console.warn('Database error in getWebPageBySlug:', error)
    return null
  }
}
