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
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const connection = await connectToDatabase()
        if (credentials == null || !credentials.email || typeof credentials.email !== 'string') return null

        if (connection.isMock) {
          // Use mock user data for authentication
          const mockUser = data.users.find(u => u.email === credentials.email)
          if (mockUser && mockUser.password) {
            const isMatch = await bcrypt.compare(
              credentials.password as string,
              mockUser.password
            )
            if (isMatch) {
                          return {
              id: 'mock-user-id',
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
            }
            }
          }
          return null
        }

        if (!connection.prisma) {
          return null
        }

        const user = await connection.prisma.user.findUnique({
          where: { email: credentials.email }
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
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          const connection = await connectToDatabase()
          if (!connection.isMock && connection.prisma) {
            await connection.prisma.user.update({
              where: { id: user.id },
              data: {
                name: user.name || user.email!.split('@')[0],
                role: 'user',
              }
            })
          }
        }
        token.name = user.name || user.email!.split('@')[0]
        token.role = (user as { role: string }).role
      }

      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },
    session: async ({ session, user, trigger, token }) => {
      session.user.id = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
  },
})
