import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import { prisma } from './lib/prisma'
import data from './lib/data'

import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from './auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: undefined, // We'll implement a custom adapter if needed
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        phone: {
          type: 'text',
          placeholder: 'رقم الهاتف',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          const connection = await connectToDatabase()
          if (credentials == null || !credentials.phone || typeof credentials.phone !== 'string') {
            console.log('Invalid credentials provided')
            return null
          }

                  if (connection.isMock) {
          console.log('Using mock authentication for phone:', credentials.phone)
          console.log('Available mock users:', data.users.map(u => ({ name: u.name, phone: u.phone })))
          
          // Use mock user data for authentication
          const mockUser = data.users.find(u => u.phone === credentials.phone)
          console.log('Found mock user:', mockUser ? mockUser.name : 'Not found')
          
          if (mockUser && mockUser.password) {
            try {
              const isMatch = await bcrypt.compare(
                credentials.password as string,
                mockUser.password
              )
              console.log('Password match:', isMatch)
              
                          if (isMatch) {
              const userData = {
                id: 'mock-user-id',
                name: mockUser.name,
                phone: mockUser.phone,
                role: mockUser.role,
              }
              console.log('Returning user data:', userData)
              return userData
            }
            } catch (bcryptError) {
              console.error('Bcrypt error:', bcryptError)
              return null
            }
          }
          console.log('Mock authentication failed')
          return null
        }

          if (!connection.prisma) {
            console.log('No Prisma connection available')
            return null
          }

          const user = await connection.prisma.user.findUnique({
            where: { phone: credentials.phone }
          })

                  if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              phone: user.phone,
              role: user.role,
            }
          }
        }
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      try {
        if (user) {
          if (!user.name) {
            const connection = await connectToDatabase()
            if (!connection.isMock && connection.prisma) {
              try {
                await connection.prisma.user.update({
                  where: { id: user.id },
                  data: {
                    name: user.name || (user.phone ? user.phone : 'User'),
                    role: 'user',
                  }
                })
              } catch (updateError) {
                console.error('Failed to update user:', updateError)
              }
            }
          }
          token.name = user.name || (user.phone ? user.phone : 'User')
          token.role = (user as { role: string }).role || 'user'
        }

        if (session?.user?.name && trigger === 'update') {
          token.name = session.user.name
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    session: async ({ session, user, trigger, token }) => {
      try {
        if (token.sub) {
          session.user.id = token.sub
        }
        if (token.role) {
          session.user.role = token.role as string
        }
        if (token.name) {
          session.user.name = token.name as string
        }
        if (trigger === 'update' && user?.name) {
          session.user.name = user.name
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
  },
})
