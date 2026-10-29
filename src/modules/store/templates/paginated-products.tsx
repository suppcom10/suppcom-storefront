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
  let products: any[] = []
  let totalCount = 0

  try {
    const data = await getProductsListWithSort({
      page: 1,
      queryParams: {
        limit: 24,
        ...(collectionId && { collection_id: [collectionId] }),
        ...(categoryId && { category_id: [categoryId] }),
        ...(productsIds && { id: productsIds }),
      },
      sortBy: sortBy || "created_at",
      countryCode,
    })

    if (data?.response?.products) {
      products = data.response.products
      totalCount = data.response.count || products.length
    }
  } catch (error) {
    console.error("Error al traer productos:", error)
  }

  // Filtrado insensible a mayúsculas/minúsculas
  let displayedProducts = products

  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    displayedProducts = products.filter((p) => {
      const title = (p?.title || "").toLowerCase()
      const description = (p?.description || "").toLowerCase()
      const handle = (p?.handle || "").toLowerCase()

      return (
        title.includes(term) ||
        description.includes(term) ||
        handle.includes(term) ||
        (term.includes("lenov") && title.includes("lenovo"))
      )
    })
    totalCount = displayedProducts.length
  }

  const totalPages = Math.ceil(totalCount / PRODUCT_LIMIT) || 1

  if (displayedProducts.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          No se encontraron productos para "{q}"[cite: 24].
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Intenta con otro término o explora las categorías del catálogo[cite: 24].
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
