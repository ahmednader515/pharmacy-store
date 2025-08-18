import { PrismaClient } from '@prisma/client'
import data from '../data'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Prisma seed...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.orderShippingAddress.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.product.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.webPage.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create users
  const users = await Promise.all(
    data.users.map(async (userData) => {
      const hashedPassword = await bcrypt.hash(userData.password, 5)
      return prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: hashedPassword,
          emailVerified: userData.emailVerified,
          address: {
            create: {
              fullName: userData.address.fullName,
              street: userData.address.street,
              city: userData.address.city,
              province: userData.address.province,
              postalCode: userData.address.postalCode,
              country: userData.address.country,
              phone: userData.address.phone,
            }
          }
        }
      })
    })
  )

  console.log(`👥 Created ${users.length} users`)

  // Create products
  const products = await Promise.all(
    data.products.map((productData) =>
      prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.slug,
          category: productData.category,
          images: productData.images,
          brand: productData.brand,
          description: productData.description,
          price: productData.price,
          listPrice: productData.listPrice,
          countInStock: productData.countInStock,
          tags: productData.tags,
          colors: productData.colors,
          sizes: productData.sizes,
          avgRating: productData.avgRating,
          numReviews: productData.numReviews,
          ratingDistribution: productData.ratingDistribution as any,
          numSales: productData.numSales,
          isPublished: productData.isPublished,
        }
      })
    )
  )

  console.log(`📦 Created ${products.length} products`)

  // Create settings
  const settings = await Promise.all(
    data.settings.map((settingData) =>
      prisma.setting.create({
        data: {
          common: settingData.common as any,
          site: settingData.site as any,
          carousels: settingData.carousels as any,
          availableLanguages: settingData.availableLanguages as any,
          defaultLanguage: settingData.defaultLanguage,
          availableCurrencies: settingData.availableCurrencies as any,
          defaultCurrency: settingData.defaultCurrency,
          availablePaymentMethods: settingData.availablePaymentMethods as any,
          defaultPaymentMethod: settingData.defaultPaymentMethod,
          availableDeliveryDates: settingData.availableDeliveryDates as any,
          defaultDeliveryDate: settingData.defaultDeliveryDate,
        }
      })
    )
  )

  console.log(`⚙️  Created ${settings.length} settings`)

  // Create web pages
  const webPages = await Promise.all(
    data.webPages.map((webPageData) =>
      prisma.webPage.create({
        data: {
          title: webPageData.title,
          slug: webPageData.slug,
          content: webPageData.content,
          isPublished: webPageData.isPublished,
        }
      })
    )
  )

  console.log(`📄 Created ${webPages.length} web pages`)

  console.log('✅ Prisma seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Prisma seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
