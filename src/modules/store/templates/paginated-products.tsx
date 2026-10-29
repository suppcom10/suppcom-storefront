import { getProductsListWithSort } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

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
  const queryParams: Record<string, any> = {
    limit: PRODUCT_LIMIT,
  }

  // Delegar el término a la consulta de Medusa
  if (q && q.trim()) {
    queryParams["q"] = q.trim()
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

  // Si Medusa devuelve la lista sin filtrar por q, aplicar filtro secundario
  if (q && q.trim() && products.length > 0) {
    const term = q.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const title = (product.title || "").toLowerCase()
      const description = (product.description || "").toLowerCase()
      const handle = (product.handle || "").toLowerCase()

      return (
        title.includes(term) ||
        description.includes(term) ||
        handle.includes(term) ||
        (term.includes("lenov") && title.includes("lenovo"))
      )
    })

    if (filtered.length > 0) {
      products = filtered
      count = filtered.length
    }
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500">
        <p className="text-base font-semibold text-neutral-800">
          No se encontraron productos para {q ? `"${q}"` : "esta categoría"}[cite: 26].
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Intenta con otro término o explora las categorías del catálogo[cite: 26].
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
        {products.map((p) => (
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
