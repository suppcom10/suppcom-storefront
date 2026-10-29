
import { getRegion } from "@lib/data/regions"
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

const BRAND_ALIASES: Record<string, string> = {
  lenvo: "Lenovo",
  lenobo: "Lenovo",
  lenov: "Lenovo",
  levono: "Lenovo",
  lenovoos: "Lenovo",
  lenova: "Lenovo",
  asuss: "ASUS",
  assus: "ASUS",
  asu: "ASUS",
  asus: "ASUS",
  hpp: "HP",
  acer: "Acer",
  acerr: "Acer",
  del: "Dell",
  dlel: "Dell",
  msi: "MSI",
  amd: "AMD",
  amf: "AMD",
  intel: "Intel",
  intell: "Intel",
  nvidia: "NVIDIA",
  nvida: "NVIDIA",
  kingstom: "Kingston",
  kingston: "Kingston",
  samsumg: "Samsung",
  samsng: "Samsung",
  corsair: "Corsair",
  logitec: "Logitech",
  logitech: "Logitech",
  gefoce: "GeForce",
  geforce: "GeForce",
  radeon: "Radeon",
  ryzen: "Ryzen",
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-PE")
    .trim()
    .replace(/\s+/g, " ")
}

function levenshtein(a: string, b: string): number {
  const previous = Array.from(
    { length: b.length + 1 },
    (_, index) => index
  )

  for (let i = 1; i <= a.length; i++) {
    let diagonal = previous[0]
    previous[0] = i

    for (let j = 1; j <= b.length; j++) {
      const above = previous[j]

      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      )

      diagonal = above
    }
  }

  return previous[b.length]
}

const KNOWN_BRANDS = [
  "Lenovo",
  "ASUS",
  "Acer",
  "Dell",
  "MSI",
  "AMD",
  "Intel",
  "NVIDIA",
  "Kingston",
  "Samsung",
  "Corsair",
  "Logitech",
  "GeForce",
  "Ryzen",
  "Radeon",
]

function correctKnownTerms(value: string): string {
  return value.replace(
    /[\p{L}\p{N}]+/gu,
    (word) => {
      const normalized = normalizeText(word)

      // Las equivalencias explícitas tienen prioridad.
      if (BRAND_ALIASES[normalized]) {
        return BRAND_ALIASES[normalized]
      }

      // No corregir automáticamente números de modelo
      // ni palabras demasiado cortas.
      if (/^\d+$/.test(word) || normalized.length < 4) {
        return word
      }

      let bestMatch = word
      let bestDistance = Infinity

      for (const brand of KNOWN_BRANDS) {
        const distance = levenshtein(
          normalized,
          normalizeText(brand)
        )

        const threshold = normalized.length >= 7 ? 2 : 1

        if (
          distance <= threshold &&
          distance < bestDistance
        ) {
          bestMatch = brand
          bestDistance = distance
        }
      }

      return bestMatch
    }
  )
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
  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <p className="py-10 text-center text-ui-fg-subtle">
        No se pudo determinar la región de la tienda.
        Inténtalo nuevamente.
      </p>
    )
  }

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

  let correctedSearch = false

  // Si no hay coincidencias, probar una corrección
  // conservadora de marcas y términos conocidos.
  if (searchTerm && result.response.products.length === 0) {
    const correctedTerm = correctKnownTerms(searchTerm)

    if (
      normalizeText(correctedTerm) !==
      normalizeText(searchTerm)
    ) {
      const correctedResult = await listProductsWithSort({
        page,
        queryParams: {
          ...queryParams,
          q: correctedTerm,
        },
        sortBy,
        countryCode,
      })

      if (correctedResult.response.products.length > 0) {
        result = correctedResult
        correctedSearch = true
      }
    }
  }

  const {
    response: { products, count },
  } = result

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      {correctedSearch && (
        <div
          className="mb-5 rounded-lg border border-neutral-200
            bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
          role="status"
        >
          Mostrando resultados relacionados con una
          posible corrección de tu búsqueda.
        </div>
      )}

      {products.length > 0 ? (
        <ul
          className="grid w-full grid-cols-2 gap-x-4 gap-y-6
            small:grid-cols-3 small:gap-x-6 small:gap-y-8
            medium:grid-cols-4"
          data-testid="products-list"
        >
          {products.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductPreview
                product={product}
                region={region}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="py-12 text-center"
          role="status"
          data-testid="no-products-message"
        >
          <h2 className="text-lg font-semibold text-neutral-900">
            {searchTerm
              ? `No encontramos productos para "${searchTerm}".`
              : "No hay productos disponibles."}
          </h2>

          {searchTerm && (
            <div className="mt-3 space-y-2 text-sm text-ui-fg-subtle">
              <p>
                Prueba con otra marca, el modelo completo
                o una característica del producto.
              </p>

              <p>
                También puedes buscar términos como
                Lenovo, ASUS, Ryzen, Intel, GeForce o SSD.
              </p>
            </div>
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
