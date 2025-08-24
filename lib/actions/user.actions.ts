'use server'

import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/auth'
import { IUserName, IUserSignIn, IUserSignUp } from '@/types'
import { UserSignUpSchema, UserUpdateSchema } from '../validator'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import data from '../data'

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const connection = await connectToDatabase()
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      phone: userSignUp.phone,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    if (connection.isMock) {
      return { success: false, error: 'User registration is not available in demo mode' }
    }

    if (!connection.prisma) {
      return { success: false, error: 'Database connection failed' }
    }

    // Check if user already exists
    const existingUser = await connection.prisma.user.findUnique({
      where: { phone: user.phone }
    })

    if (existingUser) {
      return { success: false, error: 'An account with this phone number already exists. Please sign in instead.' }
    }

    await connection.prisma.user.create({
      data: {
        name: user.name,
        phone: user.phone,
        password: await bcrypt.hash(user.password, 5),
        role: 'User',
      }
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    // Handle specific validation errors
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return { success: false, error: 'Please check your input and ensure all fields are filled correctly.' }
      }
      if (error.message.includes('unique constraint')) {
        return { success: false, error: 'An account with this phone number already exists. Please sign in instead.' }
      }
      if (error.message.includes('database')) {
        return { success: false, error: 'Database connection error. Please try again later.' }
      }
    }
    
    return { success: false, error: formatError(error) }
  }
}

// DELETE

export async function deleteUser(id: string) {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot delete user in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const res = await connection.prisma.user.delete({
      where: { id }
    })
    if (!res) throw new Error('User not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// UPDATE

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot update user in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const updatedUser = await connection.prisma.user.update({
      where: { id: user._id },
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export async function updateUserName(user: IUserName) {
  try {
    const connection = await connectToDatabase()
    const session = await auth()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot update user in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const updatedUser = await connection.prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        name: user.name,
        phone: user.phone,
      }
    })
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}
export const SignInWithGoogle = async () => {
  await signIn('google')
}
export const SignOut = async () => {
  try {
    const result = await signOut({ redirect: false })
    return { success: true, result }
  } catch (error) {
    console.error('Sign out error:', error)
    return { success: false, error: formatError(error) }
  }
}

// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const connection = await connectToDatabase()
  const {
    common: { pageSize },
  } = data.settings[0];
  limit = limit || pageSize

  if (connection.isMock) {
    console.log('📝 Mock mode: returning mock user data')
    // Return mock users from data.ts
    const mockUsers = data.users.map((user, index) => ({
      ...user,
      id: `mock-user-${index + 1}`,
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Different creation dates
    }))
    
    const skipAmount = (Number(page) - 1) * limit
    const paginatedUsers = mockUsers.slice(skipAmount, skipAmount + limit)
    
    return {
      data: JSON.parse(JSON.stringify(paginatedUsers)),
      totalPages: Math.ceil(mockUsers.length / limit),
    }
  }

  if (!connection.prisma) {
    console.warn('Database connection failed in getAllUsers')
    return {
      data: [],
      totalPages: 0,
    }
  }

  const skipAmount = (Number(page) - 1) * limit
  const users = await connection.prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    skip: skipAmount,
    take: limit
  })
  const usersCount = await connection.prisma.user.count()
  return {
    data: JSON.parse(JSON.stringify(users)),
    totalPages: Math.ceil(usersCount / limit),
  }
}

export async function getUserById(userId: string) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    return null
  }
  
  if (!connection.prisma) {
    return null
  }
  
  const user = await connection.prisma.user.findUnique({
    where: { id: userId }
  })
  if (!user) throw new Error('User not found')
  return JSON.parse(JSON.stringify(user))
}
