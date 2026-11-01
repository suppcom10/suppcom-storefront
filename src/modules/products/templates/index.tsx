
import React, { Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product?.id) {
    return notFound()
  }

  const galleryImages = images?.filter((image) => Boolean(image.url)) || []

  const specs = [
    {
      label: "Marca",
      value: product.subtitle || "",
    },
    {
      label: "Modelo",
      value: product.title || "",
    },
    {
      label: "SKU",
      value: product.variants?.[0]?.sku || "",
    },
  ].filter((spec) => spec.value)

  return (
    <>
      <main
        className="content-container bg-white pb-12 pt-6 small:pt-10"
        data-testid="product-container"
      >
        {/* Navegación */}
        <nav
          aria-label="Ruta de navegación"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-gray-500"
        >
          <a
            href={`/${countryCode}`}
            className="transition-colors hover:text-[#E6003D]"
          >
            Inicio
          </a>

          <span>/</span>

          <a
            href={`/${countryCode}/store`}
            className="transition-colors hover:text-[#E6003D]"
          >
            Productos
          </a>

          <span>/</span>

          <span className="font-medium text-gray-900">
            {product.title}
          </span>
        </nav>

        {/* Encabezado */}
        <div className="mb-7 border-b border-gray-100 pb-6">
          {product.subtitle && (
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#E6003D]">
              {product.subtitle}
            </p>
          )}

          <h1 className="max-w-5xl text-2xl font-bold leading-tight tracking-tight text-[#111111] small:text-3xl">
            {product.title}
          </h1>

          {product.variants?.[0]?.sku && (
            <p className="mt-3 text-xs text-gray-500">
              SKU: {product.variants[0].sku}
            </p>
          )}
        </div>

        {/* Galería + compra */}
        <div className="grid grid-cols-1 items-start gap-8 large:grid-cols-12 large:gap-10">
          {/* Galería */}
          <section
            aria-label="Fotografías del producto"
            className="min-w-0 large:col-span-7"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-[#F8F9FA]">
              {galleryImages.length > 0 ? (
                <div
                  className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
                  aria-label="Galería desplazable"
                >
                  {galleryImages.map((image, index) => (
                    <div
                      key={image.id || index}
                      id={`suppcom-image-${index}`}
                      className="relative aspect-[5/4] w-full shrink-0 snap-center bg-white"
                    >
                      <Image
                        src={image.url}
                        alt={`${product.title} - imagen ${index + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-contain p-5 small:p-8"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex aspect-[5/4] items-center justify-center text-sm text-gray-400">
                  Imagen no disponible
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {galleryImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image, index) => (
                  <a
                    key={image.id || index}
                    href={`#suppcom-image-${index}`}
                    aria-label={`Ver imagen ${index + 1}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-[#E6003D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E6003D]"
                  >
                    <Image
                      src={image.url}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </a>
                ))}
              </div>
            )}

            <p className="mt-2 text-xs text-gray-400">
              {galleryImages.length > 1
                ? "Desliza las imágenes para ver más fotografías."
                : "Fotografía del producto."}
            </p>
          </section>

          {/* Panel de compra */}
          <aside className="min-w-0 large:col-span-5">
            <div className="large:sticky large:top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E6003D]">
                    SUPPCOM · Tecnología
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-[#111111]">
                    Compra tu equipo
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Precios en soles para Perú
                  </p>
                </div>

                <div className="px-5 py-5">
                  {/* Componente original:
                      conserva precio, variantes y carrito */}
                  <ProductOnboardingCta />

                  <Suspense
                    fallback={
                      <ProductActions
                        disabled={true}
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

                {/* Beneficios SUPPCOM */}
                <div className="border-t border-gray-100 bg-[#FAFAFA] px-5 py-5">
                  <h3 className="mb-4 text-sm font-bold text-[#111111]">
                    Compra con confianza
                  </h3>

                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="text-lg text-[#E6003D]">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold">
                          Garantía local
                        </p>
                        <p className="text-xs text-gray-500">
                          Atención y soporte en Perú.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-lg text-[#E6003D]">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold">
                          Envíos nacionales
                        </p>
                        <p className="text-xs text-gray-500">
                          Despachos a Lima y provincias.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-lg text-[#E6003D]">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold">
                          Comprobante electrónico
                        </p>
                        <p className="text-xs text-gray-500">
                          Boleta o factura electrónica.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Información del producto */}
        <section className="mt-12 border-t border-gray-200 pt-10 small:mt-16">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#E6003D]">
              Conoce tu equipo
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
              Descripción y especificaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 large:grid-cols-12">
            <div className="min-w-0 large:col-span-7">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 small:p-7">
                <h3 className="mb-4 text-lg font-bold text-[#111111]">
                  Descripción general
                </h3>

                <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                  {product.description ||
                    "Consulta las características y opciones disponibles de este producto."}
                </p>
              </div>
            </div>

            <div className="min-w-0 large:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <h3 className="border-b border-gray-100 px-5 py-4 text-lg font-bold text-[#111111]">
                  Datos del producto
                </h3>

                <dl className="divide-y divide-gray-100">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-2 gap-3 px-5 py-4 text-sm"
                    >
                      <dt className="text-gray-500">
                        {spec.label}
                      </dt>
                      <dd className="break-words text-right font-medium text-gray-900">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Pestañas originales de Medusa */}
        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 small:p-7">
          <ProductTabs product={product} />
        </section>
      </main>

      {/* Productos relacionados */}
      <section
        className="content-container my-12 small:my-20"
        data-testid="related-products-container"
      >
        <div className="mb-7 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-[#111111]">
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
    </>
  )
}

export default ProductTemplate
