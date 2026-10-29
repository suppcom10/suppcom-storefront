import { getProductsListWithSort } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  q,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  q?: string
}) {
  // Límite seguro admitido por el backend de Medusa v2
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  // Llamada protegida contra caídas de la API
  let products: any[] = []
  let count: number = 0

  try {
    const res = await getProductsListWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    })

    products = res?.response?.products || []
    count = res?.response?.count || 0
  } catch (error) {
    console.error("Error al obtener productos:", error)
  }

  // FILTRO INTELIGENTE: Si el usuario buscó por la barra superior
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    products = products.filter((product) => {
      const title = (product.title || "").toLowerCase()
      const description = (product.description || "").toLowerCase()
      const handle = (product.handle || "").toLowerCase()

      return (
        title.includes(term) ||
        description.includes(term) ||
        handle.includes(term) ||
        (term.includes("lenov") && title.includes("lenovo")) ||
        (term.includes("rtx") && title.includes("rtx")) ||
        (term.includes("and") && title.includes("amd"))
      )
    })
    count = products.length
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500">
        <p className="text-
