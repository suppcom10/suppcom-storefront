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
  // Límite seguro admitido por el schema de Medusa v2
  const queryParams: PaginatedProductsParams = {
    limit: 20,
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

  let products: any[] = []
  let totalCount = 0

  try {
    const res = await getProductsListWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    })

    if (res?.response?.products) {
      products = res.response.products
      totalCount = res.response.count || products.length
    }
  } catch (error) {
    console.error("Error al obtener productos:", error)
  }

  // Filtrado reactivo en memoria cuando existe el parámetro de búsqueda
  let items = products

  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    items = products.filter((p) => {
      const title = (p?.title || "").toLowerCase()
      const description = (p?.description || "").toLowerCase()
      const handle = (p?.handle || "").toLowerCase()

      return (
        title.includes(term) ||
        description.includes(term) ||
        handle.includes(term)
      )
    })
    totalCount = items.length
  }

  const totalPages = Math.ceil(totalCount / PRODUCT_LIMIT) || 1

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          {q
            ? `No se encontraron productos para "${q}".`
            : "No hay productos disponibles en esta sección."}
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Intenta con otro término o explora las categorías del catálogo.
        </p>
      </div>
    )
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {items.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} countryCode={countryCode} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
