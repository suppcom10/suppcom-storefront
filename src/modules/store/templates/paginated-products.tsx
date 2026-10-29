import { getProductsList } from "@lib/data/products"
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
    limit: 50,
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

  // Obtenemos los productos con la llamada estándar directa
  const {
    response: { products, count },
  } = await getProductsList({
    pageParam: page,
    queryParams,
    countryCode,
  })

  let displayedProducts = products || []

  // Ordenamiento local según sortBy
  if (sortBy === "price_asc") {
    displayedProducts.sort((a, b) => {
      const priceA = a.variants?.[0]?.calculated_price?.calculated_amount ?? 0
      const priceB = b.variants?.[0]?.calculated_price?.calculated_amount ?? 0
      return priceA - priceB
    })
  } else if (sortBy === "price_desc") {
    displayedProducts.sort((a, b) => {
      const priceA = a.variants?.[0]?.calculated_price?.calculated_amount ?? 0
      const priceB = b.variants?.[0]?.calculated_price?.calculated_amount ?? 0
      return priceB - priceA
    })
  }

  // Filtrado de búsqueda si existe q
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    displayedProducts = displayedProducts.filter((p) => {
      const title = (p.title || "").toLowerCase()
      const desc = (p.description || "").toLowerCase()
      const handle = (p.handle || "").toLowerCase()
      return title.includes(term) || desc.includes(term) || handle.includes(term)
    })
  }

  const totalCount = q ? displayedProducts.length : count
  const totalPages = Math.ceil(totalCount / PRODUCT_LIMIT) || 1

  if (displayedProducts.length === 0) {
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
