
import { listProductsWithSort } from "@lib/data/products"
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
  q?: string
}

// Equivalencias para errores frecuentes al escribir marcas.
const SEARCH_ALIASES: Record<string, string> = {
  lenvo: "Lenovo",
  lenobo: "Lenovo",
  lenov: "Lenovo",
  lenovo: "Lenovo",
  levono: "Lenovo",
  lenovoos: "Lenovo",
  asuss: "ASUS",
  asu: "ASUS",
  assus: "ASUS",
  asus: "ASUS",
  "hewlet packard": "HP",
  "hewlett packard": "HP",
  hpp: "HP",
  hp: "HP",
}

function normalizeSearchTerm(value?: string): string {
  const original = value?.trim() ?? ""

  if (!original) {
    return ""
  }

  const normalized = original
    .toLocaleLowerCase("es-PE")
    .replace(/\s+/g, " ")

  return SEARCH_ALIASES[normalized] ?? original
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
  const searchTerm = q?.trim() ?? ""

  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  if (productsIds?.length) {
    queryParams.id = productsIds
  }

  if (sortBy === "created_at") {
    queryParams.order = "created_at"
  }

  if (searchTerm) {
    queryParams.q = searchTerm
  }

  let result = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // Si la búsqueda original no devuelve productos, probar
  // una equivalencia conocida de marca.
  if (
    searchTerm &&
    result.response.products.length === 0
  ) {
    const correctedTerm = normalizeSearchTerm(searchTerm)

    if (
      correctedTerm.toLocaleLowerCase("es-PE") !==
      searchTerm.toLocaleLowerCase("es-PE")
    ) {
      result = await listProductsWithSort({
        page,
        queryParams: {
          ...queryParams,
          q: correctedTerm,
        },
        sortBy,
        countryCode,
      })
    }
  }

  const {
    response: { products, count },
  } = result

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      {products.length > 0 ? (
        <ul
          className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
          data-testid="products-list"
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview
                product={product}
                countryCode={countryCode}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-10 text-center">
          <p className="text-ui-fg-subtle">
            {searchTerm
              ? `No encontramos productos para "${searchTerm}".`
              : "No hay productos disponibles."}
          </p>

          {searchTerm && (
            <p className="mt-2 text-sm text-ui-fg-muted">
              Verifica la escritura o prueba con otra marca,
              modelo o característica.
            </p>
          )}
        </div>
      )}

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
