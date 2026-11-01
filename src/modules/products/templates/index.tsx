
import React, { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductGallery from "./product-gallery"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

function findSpec(
  text: string,
  expressions: RegExp[]
): string | null {
  for (const expression of expressions) {
    const match = text.match(expression)
    if (match) return match[0].trim()
  }
  return null
}

function getSpecifications(product: HttpTypes.StoreProduct) {
  const source = [
    product.title,
    product.subtitle,
    product.description,
  ].filter(Boolean).join(" ")

  
const processorMatch = findSpec(source, [
  /Intel\s+Core\s+Ultra\s+[3579]\s+\d{3}[A-Z0-9]*/i,
  /\bCore\s+Ultra\s+[3579]\s+\d{3}[A-Z0-9]*/i,
  /\bUltra\s+[3579]\s+\d{3}[A-Z0-9]*/i,
  /Intel\s+Core\s+i[3579][-\s]?\d{4,5}[A-Z0-9]*/i,
  /AMD\s+Ryzen\s+(?:AI\s+)?[3579]\s+\d{4,5}[A-Z0-9]*/i,
])

const processor = processorMatch
  ? /^Ultra\s/i.test(processorMatch)
    ? `Intel Core ${processorMatch}`
    : /^Core\s+Ultra/i.test(processorMatch)
    ? `Intel ${processorMatch}`
    : processorMatch
  : null


  const ram = findSpec(source, [
    /\d{1,3}\s*GB\s*DDR[345]/i,
    /\d{1,3}\s*GB\s*(?:RAM|LPDDR[345X]*)/i,
  ])

  const storage = findSpec(source, [
    /\d+(?:\.\d+)?\s*(?:TB|GB)\s*(?:SSD|NVMe)/i,
    /(?:SSD|NVMe)\s*\d+(?:\.\d+)?\s*(?:TB|GB)/i,
  ])

  const graphics = findSpec(source, [
    /(?:NVIDIA\s+)?(?:GeForce\s+)?RTX\s+(?:PRO\s+)?\d{3,4}(?:\s*\d{1,2}\s*GB)?/i,
    /(?:AMD\s+)?Radeon\s+[A-Za-z0-9 ]{3,24}/i,
    /Intel\s+(?:Arc|Iris Xe)\s*[A-Za-z0-9]*/i,
  ])

  const display = findSpec(source, [
    /\d{2}(?:\.\d)?\s*(?:"|”|pulgadas)?\s*[/ -]?\s*(?:WUXGA|WQXGA|FHD|QHD|UHD|OLED|IPS)/i,
    /(?:WUXGA|WQXGA|FHD|QHD|UHD|OLED)\s*(?:IPS|OLED)?/i,
  ])

  const operatingSystem = findSpec(source, [
    /Windows\s+11\s+(?:Pro|Home)/i,
    /Windows\s+11/i,
    /Windows\s+10\s+(?:Pro|Home)/i,
    /(?:Ubuntu|FreeDOS|Linux)/i,
  ])

  return [
    { label: "Procesador", value: processor, icon: "CPU" },
    { label: "Memoria RAM", value: ram, icon: "RAM" },
    { label: "Almacenamiento", value: storage, icon: "SSD" },
    { label: "Tarjeta gráfica", value: graphics, icon: "GPU" },
    { label: "Pantalla", value: display, icon: "LCD" },
    { label: "Sistema operativo", value: operatingSystem, icon: "SO" },
  ].filter(
    (item): item is { label: string; value: string; icon: string } =>
      Boolean(item.value)
  )
}

export default function ProductTemplate({
  product,
  region,
  countryCode,
  images,
}: ProductTemplateProps) {
  if (!product?.id) {
    notFound()
  }

  const title = product.title || "Producto SUPPCOM"
  const displayTitle =
    title.includes("/") ? title.split("/")[0].trim() : title

  const description = product.description?.trim() || ""
  const specs = getSpecifications(product)
  const sku = product.variants?.[0]?.sku
  const photos = (images || []).filter((item) => Boolean(item.url))

  return (
    <div className="w-full bg-white text-[#171717]">
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-4 small:px-6 large:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Ruta de navegación"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500"
        >
          <Link
            href={`/${countryCode}`}
            className="hover:text-[#E6003D]"
          >
            Inicio
          </Link>
          <span>/</span>
          <Link
            href={`/${countryCode}/store`}
            className="hover:text-[#E6003D]"
          >
            Catálogo
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-800">
            {displayTitle}
          </span>
        </nav>

        {/* Encabezado compacto */}
        <header className="mb-5 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#E6003D]">
              Tecnología SUPPCOM
            </span>

            {product.subtitle && (
              <span className="text-xs font-medium text-gray-500">
                {product.subtitle}
              </span>
            )}
          </div>

          <h1 className="mt-2 text-xl font-bold leading-snug tracking-tight text-[#151515] small:text-2xl">
            {displayTitle}
          </h1>

          <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
            {sku && <span>SKU: {sku}</span>}
            {title !== displayTitle && <span>Modelo: {title}</span>}
          </div>
        </header>

        {/* Distribución principal */}
        <div className="grid grid-cols-1 items-start gap-5 large:grid-cols-12 large:gap-6">
          {/* 1. Fotografías */}
          <section
            aria-label="Galería de fotografías"
            className="min-w-0 large:col-span-5"
          >
            <ProductGallery images={photos} title={title} />

            <p className="mt-3 text-center text-xs text-gray-400">
              Fotografías del producto · Selecciona una imagen para ampliarla
            </p>
          </section>

          {/* 2. Especificaciones principales */}
          <section className="min-w-0 large:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 small:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#171717]">
                  Características principales
                </h2>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500">
                  FICHA TÉCNICA
                </span>
              </div>

              {specs.length > 0 ? (
                <dl className="divide-y divide-gray-100">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-start gap-3 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF0F3] text-[10px] font-bold text-[#E6003D]">
                        {spec.icon}
                      </span>

                      <div className="min-w-0 flex-1">
                        <dt className="text-[11px] font-medium text-gray-500">
                          {spec.label}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm font-semibold leading-snug text-[#171717]">
                          {spec.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm leading-6 text-gray-500">
                  Consulta la descripción técnica completa de este producto.
                </p>
              )}

              <a
                href="#especificaciones"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#E6003D] hover:underline"
              >
                Ver información completa
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            {/* Referencia de identificación */}
            {sku && (
              <div className="mt-3 rounded-xl bg-[#F8F8F8] px-4 py-3">
                <p className="text-[11px] text-gray-500">
                  Código de producto
                </p>
                <p className="mt-1 break-all text-xs font-semibold text-gray-800">
                  {sku}
                </p>
              </div>
            )}
          </section>

          {/* 3. Compra */}
          <aside className="min-w-0 large:col-span-3">
            <div className="large:sticky large:top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-[#FCFCFC] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#E6003D]">
                    Precio SUPPCOM
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Compra segura en Perú
                  </p>
                </div>

                <div className="px-4 py-4">
                  {/* Precio real, variantes, carrito y WhatsApp.
                      Se conserva la lógica existente de Medusa. */}
                  <Suspense
                    fallback={
                      <ProductActions
                        disabled
                        product={product}
                        region={region}
                      />
                    }
                  >
                    <ProductActionsWrapper
                      id={product.id}
                      region={region}
                    />
                  </Suspense>
                </div>

                <div className="border-t border-gray-100 bg-[#FAFAFA] px-4 py-4">
                  <h3 className="mb-3 text-xs font-bold text-gray-900">
                    Beneficios de comprar en SUPPCOM
                  </h3>

                  <div className="space-y-3">
                    <div className="flex gap-2.5">
                      <span className="font-bold text-[#E6003D]">✓</span>
                      <div>
                        <p className="text-xs font-semibold">
                          Garantía local
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Soporte y atención en Perú
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <span className="font-bold text-[#E6003D]">✓</span>
                      <div>
                        <p className="text-xs font-semibold">
                          Envíos a nivel nacional
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Lima y provincias
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <span className="font-bold text-[#E6003D]">✓</span>
                      <div>
                        <p className="text-xs font-semibold">
                          Comprobante electrónico
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Boleta o factura
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Información completa */}
        <section
          id="especificaciones"
          className="mt-10 scroll-mt-24 border-t border-gray-200 pt-8"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E6003D]">
              Detalles del producto
            </p>
            <h2 className="mt-1 text-xl font-bold small:text-2xl">
              Descripción y especificaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 large:grid-cols-12">
            <article className="rounded-2xl border border-gray-200 p-5 small:p-6 large:col-span-8">
              <h3 className="mb-4 text-base font-bold">
                Descripción técnica
              </h3>

              <div className="whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                {description ||
                  "Consulta las características y opciones de este producto."}
              </div>
            </article>

            <div className="rounded-2xl border border-gray-200 p-5 small:p-6 large:col-span-4">
              <h3 className="mb-4 text-base font-bold">
                Identificación
              </h3>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Modelo</dt>
                  <dd className="mt-1 font-medium">{title}</dd>
                </div>

                {sku && (
                  <div>
                    <dt className="text-xs text-gray-500">SKU</dt>
                    <dd className="mt-1 break-all font-medium">{sku}</dd>
                  </div>
                )}

                {product.subtitle && (
                  <div>
                    <dt className="text-xs text-gray-500">Línea</dt>
                    <dd className="mt-1 font-medium">
                      {product.subtitle}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* Productos relacionados */}
      <section className="mx-auto my-12 w-full max-w-[1600px] px-4 small:px-6 large:px-8">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold small:text-2xl">
            También te puede interesar
          </h2>
        </div>

        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts
            product={product}
            countryCode={countryCode}
          />
        </Suspense>
      </section>
    </div>
  )
}
