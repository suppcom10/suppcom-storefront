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
  const queryParams: PaginatedProductsParams = {
    limit: 100, // Traemos el lote para poder filtrar localmente si hay búsqueda
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

  let {
    response: { products, count },
  } = await getProductsListWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // FILTRO INTELIGENTE: Si el usuario buscó algo por la barra
  if (q && q.trim()) {
    const term = q.trim().toLowerCase()
    products = products.filter((product) => {
      const title = (product.title || "").toLowerCase()
      const description = (product.description || "").toLowerCase()
      const handle = (product.handle || "").toLowerCase()

      // Coincidencia directa o typo común
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
        <p className="text-base font-medium">No se encontraron productos para tu búsqueda.</p>
        <p className="text-xs text-neutral-400 mt-1">Intenta con otro término o revisa las categorías.</p>
      </div>
    )
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} countryCode={countryCode} />
            </li>
          )
        })}
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
