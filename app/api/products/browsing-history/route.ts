import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import data from '@/lib/data'

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get('type') || 'history'
  const productIdsParam = request.nextUrl.searchParams.get('ids')
  const categoriesParam = request.nextUrl.searchParams.get('categories')

  if (!productIdsParam || !categoriesParam) {
    return NextResponse.json([])
  }

  const productIds = productIdsParam.split(',')
  const categories = categoriesParam.split(',')
  const filter =
    listType === 'history'
      ? {
          id: { in: productIds },
        }
      : { category: { in: categories }, id: { notIn: productIds } }

  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    const mockProducts = data.products.filter(p => {
      if (listType === 'history') {
        return productIds.includes(p.slug)
      } else {
        return categories.includes(p.category) && !productIds.includes(p.slug)
      }
    })
    
    if (listType === 'history') {
      return NextResponse.json(
        mockProducts.sort(
          (a, b) =>
            productIds.indexOf(a.slug) -
            productIds.indexOf(b.slug)
        )
      )
    }
    return NextResponse.json(mockProducts)
  }
  
  const products = await connection.prisma.product.findMany({
    where: filter
  })
  
  if (listType === 'history')
    return NextResponse.json(
      products.sort(
        (a: any, b: any) =>
          productIds.indexOf(a.id) -
          productIds.indexOf(b.id)
      )
    )
  return NextResponse.json(products)
}
