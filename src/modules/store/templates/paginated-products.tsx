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

  // Si no hay término de búsqueda, render normal
  if (!q || !q.trim()) {
    const totalPages = Math.ceil(count / PRODUCT_LIMIT)
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

  // Si HAY búsqueda, filtramos revisando todos los textos posibles del producto
  const cleanQ = q.trim().toLowerCase()
  const filteredProducts = products.filter((p) => {
    const serialized = JSON.stringify(p).toLowerCase()
    return serialized.includes(cleanQ)
  })

  if (filteredProducts.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          No se encontraron productos para "{q}"[cite: 18].
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Productos evaluados en esta página: {products.length}.
        </p>
      </div>
    )
  }

  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
      data-testid="products-list"
    >
      {filteredProducts.map((p) => (
        <li key={p.id}>
          <ProductPreview product={p} countryCode={countryCode} />
        </li>
      ))}
    </ul>
  )
}
