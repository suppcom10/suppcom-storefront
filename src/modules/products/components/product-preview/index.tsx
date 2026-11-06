import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductPrice } from "@lib/util/get-product-price"

function cleanCommercialTitle(product: HttpTypes.StoreProduct): string {
  const custom = product.metadata?.suppcom_title
  if (typeof custom === "string" && custom.trim()) return custom.trim()

  const raw = (product.title || "Producto SUPPCOM").trim()
  return raw.split("/")[0].trim() || raw
}

function technicalSummary(product: HttpTypes.StoreProduct): string {
  const custom = product.metadata?.suppcom_short_specs
  if (typeof custom === "string" && custom.trim()) return custom.trim()

  const text = [product.title, product.description]
    .filter(Boolean)
    .join(" ")

  const cpu = text.match(/(?:Intel\s+Core\s+)?Ultra\s+[3579]\s+\d{3}[A-Z0-9]*/i)?.[0]
    ?? text.match(/(?:AMD\s+)?Ryzen\s+(?:AI\s+)?[3579]\s+\d{4,5}[A-Z0-9]*/i)?.[0]
    ?? text.match(/(?:Intel\s+)?Core\s+i[3579][\s-]?\d{4,5}[A-Z0-9]*/i)?.[0]

  const ram = text.match(/\b\d{1,3}\s*GB\s*(?:LPDDR\w*|DDR[345])\b/i)?.[0]
  const disk = text.match(/\b\d+(?:\.\d+)?\s*(?:TB|GB)\s*(?:SSD|NVMe)\b/i)?.[0]

  const normalizedCpu = cpu
    ? /^Ultra\b/i.test(cpu) ? `Intel Core ${cpu}` : cpu
    : null

  return [normalizedCpu, ram, disk].filter(Boolean).slice(0, 3).join(" · ")
}

function isExplicitlySoldOut(product: HttpTypes.StoreProduct): boolean {
  const variants = product.variants ?? []
  if (!variants.length) return false

  return variants.every((variant) => {
    if (variant.manage_inventory === false) return false
    if (variant.allow_backorder) return false
    return typeof variant.inventory_quantity === "number" && variant.inventory_quantity <= 0
  })
}

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const name = cleanCommercialTitle(product)
  const summary = technicalSummary(product)
  const soldOut = isExplicitlySoldOut(product)
  const price = getProductPrice({ product }).cheapestPrice

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <article
        data-testid="product-wrapper"
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg"
      >
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white">
          <span className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-md border border-neutral-200/60 bg-white/95 px-2 py-0.5 text-[10px] font-bold tracking-tight text-neutral-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Garantía Oficial
          </span>
          {isFeatured && (
            <span className="absolute right-2 top-2 z-10 rounded-md bg-[#E6003D] px-2 py-1 text-[10px] font-bold text-white">
              Destacado
            </span>
          )}
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            className="transition-transform duration-300 group-hover:scale-[1.025]"
          />
        </div>

        <div className="mt-3 flex flex-1 flex-col">
          <h3
            className="line-clamp-2 text-sm font-bold leading-snug text-neutral-900 transition-colors group-hover:text-[#E6003D]"
            data-testid="product-title"
          >
            {name}
          </h3>


          {summary && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-neutral-600">
              {summary}
            </p>
          )}

          <div className="mt-2">
            {soldOut ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Agotado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Disponible
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 pt-3">
            <div className="min-w-0 text-sm font-extrabold text-neutral-950 sm:text-base">
              {price ? <PreviewPrice price={price} /> : (
                <span className="text-xs font-medium text-neutral-500">Consultar precio</span>
              )}
            </div>
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-[#E6003D] group-hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
