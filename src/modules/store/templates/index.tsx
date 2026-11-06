import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
}) => {
  const parsed = page ? Number.parseInt(page, 10) : 1
  const pageNumber = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  const sort = sortBy || "created_at"
  const term = q?.trim()

  return (
    <div className="content-container py-6 small:py-8" data-testid="category-container">
      <header className="mb-6 rounded-2xl border border-neutral-200 bg-white px-5 py-5 shadow-sm small:px-7 small:py-6">
        <p className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-[#E6003D]">
          Catálogo SUPPCOM Perú
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 small:text-3xl" data-testid="store-page-title">
          {term ? `Resultados para: “${term}”` : "Todos los productos"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          {term
            ? "Explora los productos relacionados con tu búsqueda y compara sus características."
            : "Explora laptops y tecnología, compara sus características y encuentra el equipo ideal para ti."}
        </p>
      </header>

      <div className="flex flex-col small:flex-row small:items-start small:gap-6">
        <RefinementList sortBy={sort} />
        <div className="min-w-0 w-full flex-1">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              q={q}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
