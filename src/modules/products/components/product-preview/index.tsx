import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full"
    >
      <div
        data-testid="product-wrapper"
        className="relative flex flex-col justify-between h-full bg-white rounded-2xl border border-neutral-200/80 p-3.5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300"
      >
        {/* Contenedor de Imagen y Badges Técnicos */}
        <div className="relative w-full aspect-square bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center">
          {/* Badge superior izquierdo: Garantía Oficial */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-xs border border-neutral-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-neutral-700 tracking-tight">
              Garantía Oficial
            </span>
          </div>

          {/* Badge superior derecho si está en oferta o destacado */}
          {isFeatured && (
            <div className="absolute top-2.5 right-2.5 z-10 bg-[#E31837] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              Top Ventas
            </div>
          )}

          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="group-hover:scale-105 transition-transform duration-300 object-contain p-2"
          />
        </div>

        {/* Información Técnica y Precios */}
        <div className="flex flex-col justify-between flex-1 mt-3.5 gap-y-2">
          <div>
            <Text
              className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-[#E31837] transition-colors line-clamp-2 leading-snug"
              data-testid="product-title"
            >
              {product.title}
            </Text>

            {/* Subtítulo de confianza rápida */}
            <span className="inline-block mt-1 text-[11px] text-neutral-400 font-medium">
              Stock Inmediato • Boleta / Factura
            </span>
          </div>

          {/* Precio y Botón Visual */}
          <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 mt-auto">
            <div className="text-sm sm:text-base font-bold text-neutral-950">
              <PreviewPrice price={product.price} />
            </div>

            <span className="inline-flex items-center justify-center p-2 rounded-lg bg-neutral-50 text-neutral-600 group-hover:bg-[#E31837] group-hover:text-white transition-colors duration-150">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
