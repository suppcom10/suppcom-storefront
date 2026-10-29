import { getProductsList, getProductsListWithSort } from "@lib/data/products"
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
  // CASO 1: Si hay un término de búsqueda (ej. "lenovo")
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    let searchProducts: any[] = []

    try {
      // Traemos una lista amplia sin restringir a solo la página 1
      const res = await getProductsList({
        pageParam: 1,
        queryParams: {
          limit: 100,
          ...(collectionId && { collection_id: [collectionId] }),
          ...(categoryId && { category_id: [categoryId] }),
        },
        countryCode,
      })

      searchProducts = res?.response?.products || []
    } catch (e) {
      // Si falla getProductsList, intentamos con getProductsListWithSort
      try {
        const fallback = await getProductsListWithSort({
          page: 1,
          queryParams: { limit: 50 },
          sortBy: "created_at",
          countryCode,
        })
        searchProducts = fallback?.response?.products || []
      } catch (err) {
        console.error("Error en búsqueda:", err)
      }
    }

    // Filtrar sobre todo el catálogo obtenido
    const matchedProducts = searchProducts.filter((p) => {
      const title = (p?.title || "").toLowerCase()
      const desc = (p?.description || "").toLowerCase()
      const handle = (p?.handle || "").toLowerCase()
      return title.includes(term) || desc.includes(term) || handle.includes(term)
    })

    if (matchedProducts.length === 0) {
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

    return (
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {matchedProducts.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} countryCode={countryCode} />
          </li>
        ))}
      </ul>
    )
  }

  // CASO 2: Navegación estándar de la tienda (sin búsqueda)
  let normalProducts: any[] = []
  let totalCount = 0

  try {
    const res = await getProductsListWithSort({
      page,
      queryParams: {
        limit: PRODUCT_LIMIT,
        ...(collectionId && { collection_id: [collectionId] }),
        ...(categoryId && { category_id: [categoryId] }),
        ...(productsIds && { id: productsIds }),
        order: sortBy === "created_at" ? "created_at" : undefined,
      },
      sortBy,
      countryCode,
    })

    normalProducts = res?.response?.products || []
    totalCount = res?.response?.count || 0
  } catch (error) {
    console.error("Error cargando productos:", error)
  }

  const totalPages = Math.ceil(totalCount / PRODUCT_LIMIT) || 1

  if (normalProducts.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          No hay productos disponibles en esta sección.
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
        {normalProducts.map((p) => (
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
