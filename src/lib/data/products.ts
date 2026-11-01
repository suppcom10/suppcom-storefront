
"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

const PRODUCT_REVALIDATE_SECONDS = 21600

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const currentPage = Math.max(pageParam, 1)
  const offset = (currentPage - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: {
        products: [],
        count: 0,
      },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const { products, count } = await sdk.client.fetch<{
    products: HttpTypes.StoreProduct[]
    count: number
  }>("/store/products", {
    method: "GET",
    query: {
      limit,
      offset,
      region_id: region.id,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
      ...queryParams,
    },
    headers,
    next: {
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    },
  })

  const nextPage =
    count > offset + limit ? currentPage + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  }
}

/**
 * Obtiene hasta 100 productos, los ordena y devuelve
 * la página solicitada.
 *
 * La revalidación de la consulta se controla en listProducts.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: {
    products: HttpTypes.StoreProduct[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  const currentPage = Math.max(page, 1)

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    endIndex
  )

  const nextPage =
    count > endIndex ? currentPage + 1 : null

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
