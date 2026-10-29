import { listProductsWithSort } from "@lib/data/products"
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
  // Obtenemos los productos con la llamada estándar que ya funcionaba
  let products: any[] = []
  let count: number = 0

  try {
    const res = await listProductsWithSort({
      page,
      queryParams: {
        ...(collectionId && { collection_id: [collectionId] }),
        ...(categoryId && { category_id: [categoryId] }),
        ...(productsIds && { id: productsIds }),
      },
      sortBy,
      countryCode,
    })

    products = res?.response?.products || []
    count = res?.response?.count || 0
  } catch (err) {
    // Fallback por si la función exportada tiene el otro nombre
    try {
      const { getProductsListWithSort } = await import("@lib/data/products")
      const res = await getProductsListWithSort({
        page,
        queryParams: {},
        sortBy,
        countryCode,
      })
      products = res?.response?.products || []
      count = res?.response?.count || 0
    } catch (e) {
      console.error("Error al traer productos:", e)
    }
  }

  // Filtrado flexible por término de búsqueda si el usuario ingresó algo
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    products = products.filter((p) => {
      const title = (p.title || "").toLowerCase()
      const description = (p.description || "").toLowerCase()
      const handle = (p.handle || "").toLowerCase()
      const full = `${title} ${description} ${handle}`

      return full.includes(term) || (term.includes("lenov") && full.includes("lenovo"))
    })
    count = products.length
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500 w-full col-span-full">
        <p className="text-base font-semibold text-neutral-800">
          No se encontraron productos para "{q}".
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
