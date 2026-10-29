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
    limit: 12,
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

  // Llamada estándar nativa de Medusa v2 (el orden lo maneja sortBy, NUNCA order en queryParams)
  let products: any[] = []
  let count = 0

  try {
    const res = await getProductsListWithSort({
      page,
      queryParams,
      sortBy: sortBy || "created_at",
      countryCode,
    })

    products = res?.response?.products || []
    count = res?.response?.count || 0
  } catch (error) {
    console.error("Error al obtener productos:", error)
  }

  // Si el usuario buscó por la barra (?q=...), filtramos el lote recibido
  let displayedProducts = products
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    displayedProducts = products.filter((p) => {
      const title = (p?.title || "").toLowerCase()
      const desc = (p?.description || "").toLowerCase()
      const handle = (p?.handle || "").toLowerCase()
      return title.includes(term) || desc.includes(term) || handle.includes(term)
    })
  }

  const totalPages = Math.ceil(
    (q ? displayedProducts.length : count) / PRODUCT_LIMIT
  ) || 1

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
