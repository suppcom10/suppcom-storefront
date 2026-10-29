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

  let products: any[] = []
  let count = 0

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
    console.error("Error al cargar productos de Medusa:", error)
  }

  // Si no hay productos en la tienda en absoluto
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          No hay productos disponibles en esta sección.
        </p>
      </div>
    )
  }

  // Filtrado reactivo en caso de búsqueda
  let displayedProducts = products
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    displayedProducts = products.filter((p) => {
      const title = (p?.title || "").toLowerCase()
      const desc = (p?.description || "").toLowerCase()
      const handle = (p?.handle || "").toLowerCase()

      return (
        title.includes(term) ||
        desc.includes(term) ||
        handle.includes(term) ||
        (term.includes("lenov") && title.includes("lenovo"))
      )
    })
  }

  if (displayedProducts.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          No se encontraron productos para &quot;{q}&quot;.
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Intenta con otro término o explora las categorías del catálogo.
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil((q ? displayedProducts.length : count) / PRODUCT_LIMIT) || 1

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {displayedProducts.map((p) => (
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
