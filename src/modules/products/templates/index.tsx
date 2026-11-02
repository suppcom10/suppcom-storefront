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

type SpecKey = "CPU" | "RAM" | "SSD" | "GPU" | "LCD" | "SO"

type SpecItem = {
  label: string
  value: string
  icon: SpecKey
}

function findSpec(text: string, expressions: RegExp[]): string | null {
  for (const expression of expressions) {
    const match = text.match(expression)
    if (match) return match[0].trim()
  }
  return null
}

function normalizeProcessor(raw: string): string {
  const clean = raw.trim().toUpperCase()

  // Traduce códigos cortos de mayorista (ej. U7356H -> Intel Core Ultra 7)
  if (/^U[3579]\d{3}[A-Z]*/i.test(clean)) {
    const tier = clean.charAt(1)
    const model = clean.slice(2)
    return `Intel Core Ultra ${tier} (${model})`
  }
  if (/^CI[3579]\b/i.test(clean)) {
    const tier = clean.charAt(2)
    return `Intel Core i${tier}`
  }
  if (/^Ultra\s/i.test(raw)) {
    return `Intel Core ${raw}`
  }
  if (/^Core\s+Ultra/i.test(raw)) {
    return `Intel ${raw}`
  }
  return raw
}

function getSpecifications(product: HttpTypes.StoreProduct): SpecItem[] {
  const source = [
    product.title,
    product.subtitle,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")

  const processorMatch = findSpec(source, [
    /Intel\s+Core\s+Ultra\s+[3579]\s+\d{3}[A-Z0-9]*/i,
    /\bCore\s+Ultra\s+[3579]\s+\d{3}[A-Z0-9]*/i,
    /\bUltra\s+[3579]\s+\d{3}[A-Z0-9]*/i,
    /Intel\s+Core\s+i[3579][-\s]?\d{4,5}[A-Z0-9]*/i,
    /\bCore\s+i[3579][-\s]?\d{4,5}[A-Z0-9]*/i,
    /AMD\s+Ryzen\s+(?:AI\s+)?[3579]\s+\d{4,5}[A-Z0-9]*/i,
    /\bRyzen\s+[3579]\s+\d{4,5}[A-Z0-9]*/i,
    /\bU[3579]\d{3}[A-Z]{1,2}\b/i,
    /\bCI[3579]\b/i,
  ])

  const processor = processorMatch ? normalizeProcessor(processorMatch) : null

  const ram =
    findSpec(source, [
      /\d{1,3}\s*GB\s*DDR[345]/i,
      /\d{1,3}\s*GB\s*(?:RAM|LPDDR[345X]*)/i,
    ]) ||
    (() => {
      // Detecta patrón de barra de mayorista: /32/1/ -> 32GB RAM
      const slashMatch = source.match(/\/(8|16|24|32|48|64|96|128)\/(?:512|1|2|4)/)
      return slashMatch ? `${slashMatch[1]}GB RAM` : null
    })()

  const storage =
    findSpec(source, [
      /\d+(?:\.\d+)?\s*(?:TB|GB)\s*(?:SSD|NVMe|M\.2)/i,
      /(?:SSD|NVMe)\s*\d+(?:\.\d+)?\s*(?:TB|GB)/i,
    ]) ||
    (() => {
      const slashStorage = source.match(/\/(?:8|16|24|32|48|64)\/(512GB|512|1TB|1|2TB|2)\b/i)
      if (!slashStorage) return null
      const val = slashStorage[1].toUpperCase()
      if (val === "512") return "512GB SSD NVMe"
      if (val === "1" || val === "2") return `${val}TB SSD NVMe`
      return `${val} SSD`
    })()

  const graphics = findSpec(source, [
    /(?:NVIDIA\s+)?(?:GeForce\s+)?RTX\s+(?:PRO\s+)?\d{3,4}(?:\s*Ada)?(?:\s*\d{1,2}\s*GB)?/i,
    /(?:AMD\s+)?Radeon\s+RX\s+\d{3,4}[A-Za-z0-9 ]*/i,
    /(?:AMD\s+)?Radeon\s+[A-Za-z0-9 ]{3,20}/i,
    /Intel\s+(?:Arc|Iris\s+Xe)\s*[A-Za-z0-9]*/i,
  ])

  const display = findSpec(source, [
    /\d{2}(?:\.\d)?\s*(?:"|”|''|pulgadas)?\s*[/ -]?\s*(?:WUXGA|WQXGA|FHD|QHD|UHD|OLED|IPS)/i,
    /(?:WUXGA|WQXGA|FHD|QHD|UHD|OLED)\s*(?:IPS|OLED)?/i,
    /\b1[34567](?:\.\d)?\s*(?:"|”|pulg)/i,
  ])

  const operatingSystem =
    findSpec(source, [
      /Windows\s+11\s+(?:Pro|Home)/i,
      /Windows\s+11/i,
      /Windows\s+10\s+(?:Pro|Home)/i,
      /(?:Ubuntu|FreeDOS|Linux)/i,
    ]) ||
    (/\bW11P\b/i.test(source)
      ? "Windows 11 Pro"
      : /\bW11H?\b/i.test(source)
      ? "Windows 11 Home"
      : /\bUBU\b/i.test(source)
      ? "Linux Ubuntu"
      : null)

  // Orden de prioridad de conversión en hardware: CPU -> GPU -> RAM -> SSD -> Pantalla -> SO
  const rawList: { label: string; value: string | null; icon: SpecKey }[] = [
    { label: "Procesador", value: processor, icon: "CPU" },
    { label: "Tarjeta gráfica", value: graphics, icon: "GPU" },
    { label: "Memoria RAM", value: ram, icon: "RAM" },
    { label: "Almacenamiento", value: storage, icon: "SSD" },
    { label: "Pantalla", value: display, icon: "LCD" },
    { label: "Sistema operativo", value: operatingSystem, icon: "SO" },
  ]

  return rawList.filter((item): item is SpecItem => Boolean(item.value))
}

function SpecIcon({ type }: { type: SpecKey }) {
  switch (type) {
    case "CPU":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          <path strokeLinecap="round" d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      )
    case "RAM":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18v8H3V8zm4 3v2m4-2v2m4-2v2m4-2v2M6 16v2m4-2v2m4-2v2m4-2v2" />
        </svg>
      )
    case "SSD":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path strokeLinecap="round" d="M8 15h4m4 0h.01M8 9h8" />
        </svg>
      )
    case "GPU":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="9" cy="12" r="2.5" />
          <circle cx="15.5" cy="12" r="2.5" />
        </svg>
      )
    case "LCD":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path strokeLinecap="round" d="M8 20h8m-4-4v4" />
        </svg>
      )
    case "SO":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5L11 4.5v6.5H4V5.5zm8-1.1L20 3v8h-8V4.4zM4 12.5h7V19l-7-1v-5.5zm8 0h8V21l-8-1.2v-7.3z" />
        </svg>
      )
  }
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

  const rawTitle = product.title || "Producto SUPPCOM"
  const baseName = rawTitle.includes("/") ? rawTitle.split("/")[0].trim() : rawTitle

  // Limpia el separador [@@@] propio de Deltron si viene en la descripción
  const rawDescription = product.description?.trim() || ""
  const cleanDescription = rawDescription
    .replace(/\[@@@\]/g, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .trim()

  const shortHeadline = rawDescription.includes("[@@@]")
    ? rawDescription.split("[@@@]")[0].replace(/<[^>]+>/g, "").trim()
    : null

  const specs = getSpecifications(product)
  const variant = product.variants?.[0]
  const sku = variant?.sku
  const partNumber =
    (product.metadata?.part_number as string | undefined) ||
    variant?.barcode ||
    null

  // Construye un título comercial más rico al estilo Newegg / Memory Kings
  const keySummary = specs
    .slice(0, 4)
    .map((s) => s.value)
    .join(" · ")

  const displayTitle = shortHeadline || baseName
  const photos = (images || []).filter(
    (item) => Boolean(item.url) && !item.url.includes("blanco.jpg")
  )

  return (
    <div className="w-full bg-[#FAFAFA] text-[#171717]">
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-14 pt-3 small:px-6 large:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Ruta de navegación"
          className="mb-2.5 flex flex-wrap items-center gap-2 text-xs text-gray-500"
        >
          <Link href={`/${countryCode}`} className="transition-colors hover:text-[#E6003D]">
            Inicio
          </Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${countryCode}/store`} className="transition-colors hover:text-[#E6003D]">
            Catálogo
          </Link>
          {product.collection && (
            <>
              <span className="text-gray-300">/</span>
              <Link
                href={`/${countryCode}/collections/${product.collection.handle}`}
                className="transition-colors hover:text-[#E6003D]"
              >
                {product.collection.title}
              </Link>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="max-w-[260px] truncate font-medium text-gray-800 small:max-w-md">
            {baseName}
          </span>
        </nav>

        {/* Encabezado compacto: título, resumen y SKU en el mismo flujo */}
        <header className="mb-3 rounded-2xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm small:px-5 small:py-4">
          <div className="flex flex-wrap items-center gap-2">
            {product.subtitle && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF0F3] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#E6003D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E6003D]" />
                {product.subtitle}
              </span>
            )}
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              ✓ Equipos originales · Garantía local
            </span>
          </div>

          <h1 className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-gray-900 small:text-[25px]">
            {displayTitle}
          </h1>

          {keySummary && (
            <p className="mt-1 text-xs font-medium leading-relaxed text-gray-700 small:text-sm">
              {keySummary}
            </p>
          )}

          {(sku || partNumber) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
              {sku && (
                <span>
                  SKU: <strong className="font-mono font-semibold text-gray-800">{sku}</strong>
                </span>
              )}
              {partNumber && partNumber !== sku && (
                <span>
                  P/N: <strong className="font-mono font-semibold text-gray-800">{partNumber}</strong>
                </span>
              )}
            </div>
          )}
        </header>

        {/* Distribución Principal (3 Columnas estilo Newegg / B&H) */}
        <div className="grid grid-cols-1 items-start gap-4 large:grid-cols-12 large:gap-5">
          {/* COLUMNA 1: Fotografías (5 cols) */}
          <section
            aria-label="Galería de fotografías"
            className="min-w-0 large:col-span-5"
          >
            <div className="rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm small:p-4">
              <ProductGallery images={photos} title={displayTitle} />
            </div>
          </section>

          {/* COLUMNA 2: Especificaciones de Impacto + Logística Perú (4 cols) */}
          <section className="min-w-0 space-y-4 large:col-span-4">
            {/* Tarjeta de Especificaciones Clave */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-1 rounded-full bg-[#E6003D]" />
                  <h2 className="text-base font-bold text-gray-900">
                    Especificaciones clave
                  </h2>
                </div>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  Resumen
                </span>
              </div>

              {specs.length > 0 ? (
                <dl className="grid grid-cols-1 gap-2.5">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-[#FCFCFC] p-3 transition-colors hover:border-red-100 hover:bg-[#FFF9FA]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#E6003D] shadow-xs">
                        <SpecIcon type={spec.icon} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                          {spec.label}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm font-bold leading-snug text-gray-900">
                          {spec.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                  {cleanDescription
                    ? cleanDescription.slice(0, 220) + (cleanDescription.length > 220 ? "..." : "")
                    : "Consulta los detalles técnicos y las características en la parte inferior."}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <a
                  href="#especificaciones"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E6003D] transition-colors hover:text-red-700"
                >
                  Ver ficha técnica completa
                  <span aria-hidden="true">↓</span>
                </a>
                <span className="text-[11px] text-gray-400">
                  Garantía local en Perú
                </span>
              </div>
            </div>

            {/* Tarjeta de Logística y Despacho (Reemplaza el bloque gris repetido de SKU) */}
            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-800">
                Opciones de entrega y recojo
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    🚚
                  </span>
                  <div>
                    <strong className="text-gray-900">Despacho rápido en Lima Metropolitana:</strong>{" "}
                    Consulta las opciones y plazos de entrega según tu distrito.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    📦
                  </span>
                  <div>
                    <strong className="text-gray-900">Envíos a todo el Perú:</strong>{" "}
                    Coordinamos el envío a provincias según el destino.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    🏢
                  </span>
                  <div>
                    <strong className="text-gray-900">Atención Corporativa (RUC 20):</strong>{" "}
                    Emitimos Factura Electrónica con IGV desglosado y cotizaciones formales.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* COLUMNA 3: Buy Box de Alta Conversión (3 cols) */}
          <aside className="min-w-0 large:col-span-3">
            <div className="large:sticky large:top-24">
              <div className="overflow-hidden rounded-2xl border-2 border-gray-900/10 bg-white shadow-md">
                {/* Cabecera de Estado de Stock en Vivo */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#FFF5F7] to-white px-4 py-3">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#E6003D]">
                      Precio Online SUPPCOM
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      Precio en soles · Incluye IGV (18%)
                    </p>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                    Venta online
                  </span>
                </div>

                {/* Cuerpo de Acciones de Medusa (Precio + Botones) */}
                <div className="p-4 small:p-5">
                  <Suspense
                    fallback={
                      <ProductActions
                        disabled
                        product={product}
                        region={region}
                      />
                    }
                  >
                    <ProductActionsWrapper id={product.id} region={region} />
                  </Suspense>

                  {/* Nota de Medios de Pago Locales */}
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                    <p className="text-[11px] font-semibold text-gray-700">
                      Medios de pago aceptados:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-bold text-gray-700">
                        Transferencia BCP / Interbank
                      </span>
                      <span className="rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                        Yape / Plin
                      </span>
                      <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        Tarjetas Visa / Mastercard
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pie de Garantías */}
                <div className="border-t border-gray-100 bg-[#FAFAFA] px-4 py-4">
                  <h3 className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-gray-800">
                    Respaldo SUPPCOM Perú
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFF0F3] text-[10px] font-bold text-[#E6003D]">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">Garantía local</p>
                        <p className="text-[11px] text-gray-500">
                          Atención y soporte de SUPPCOM en Perú
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFF0F3] text-[10px] font-bold text-[#E6003D]">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">Boleta o Factura Electrónica</p>
                        <p className="text-[11px] text-gray-500">
                          Comprobante SUNAT válido para crédito fiscal (RUC 20)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFF0F3] text-[10px] font-bold text-[#E6003D]">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">Atención personalizada</p>
                        <p className="text-[11px] text-gray-500">
                          Asesoría para elegir tu equipo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* SECCIÓN INFERIOR: Ficha Técnica Completa y Tabla Zebra */}
        <section
          id="especificaciones"
          className="mt-12 scroll-mt-24"
        >
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm small:p-8">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#E6003D]">
                Información Técnica Detallada
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-gray-900 small:text-2xl">
                Especificaciones y Descripción del Producto
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 large:grid-cols-12">
              {/* Descripción y Características */}
              <article className="large:col-span-7">
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  Descripción General
                </h3>

                <div className="whitespace-pre-line break-words rounded-xl bg-[#FAFAFA] p-4 text-sm leading-7 text-gray-700 border border-gray-100">
                  {cleanDescription ||
                    `Consulta las características y especificaciones de ${displayTitle}.`}
                </div>
              </article>

              {/* Tabla Zebra de Identificación y Ficha */}
              <div className="large:col-span-5">
                <h3 className="mb-3 text-base font-bold text-gray-900">
                  Ficha de Identificación
                </h3>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <dl className="divide-y divide-gray-200 text-xs small:text-sm">
                    <div className="grid grid-cols-3 bg-gray-50 px-4 py-3">
                      <dt className="font-semibold text-gray-500">Producto</dt>
                      <dd className="col-span-2 font-bold text-gray-900">{baseName}</dd>
                    </div>

                    {sku && (
                      <div className="grid grid-cols-3 bg-white px-4 py-3">
                        <dt className="font-semibold text-gray-500">SKU SUPPCOM</dt>
                        <dd className="col-span-2 font-mono font-semibold text-gray-800">{sku}</dd>
                      </div>
                    )}

                    {partNumber && (
                      <div className="grid grid-cols-3 bg-gray-50 px-4 py-3">
                        <dt className="font-semibold text-gray-500">Part Number</dt>
                        <dd className="col-span-2 font-mono font-semibold text-gray-800">
                          {partNumber}
                        </dd>
                      </div>
                    )}

                    {product.subtitle && (
                      <div className="grid grid-cols-3 bg-white px-4 py-3">
                        <dt className="font-semibold text-gray-500">Marca / Línea</dt>
                        <dd className="col-span-2 font-medium text-gray-800">
                          {product.subtitle}
                        </dd>
                      </div>
                    )}

                    {specs.map((spec, idx) => (
                      <div
                        key={spec.label}
                        className={`grid grid-cols-3 px-4 py-3 ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <dt className="font-semibold text-gray-500">{spec.label}</dt>
                        <dd className="col-span-2 font-semibold text-gray-900">
                          {spec.value}
                        </dd>
                      </div>
                    ))}

                    <div className="grid grid-cols-3 bg-white px-4 py-3">
                      <dt className="font-semibold text-gray-500">Condición</dt>
                      <dd className="col-span-2 font-semibold text-emerald-700">
                        Consultar condición y presentación
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Productos Relacionados */}
      <section className="mx-auto my-10 w-full max-w-[1440px] px-4 small:px-6 large:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#E6003D]">
              Alternativas Recomendadas
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-gray-900 small:text-2xl">
              También te puede interesar
            </h2>
          </div>
        </div>

        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </section>
    </div>
  )
}
