import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{
    countryCode: string
    handle: string
  }>
  searchParams: Promise<{
    v_id?: string
  }>
}

export const dynamic = "force-dynamic"

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  const productImages = product.images ?? []

  // En el piloto SUPPCOM cada producto tiene una sola variante.
  // Mostrar todas las imágenes de Media evita ocultar fotos recién agregadas.
  // Priorizar la miniatura elegida en Medusa para la fotografía principal.
  const orderedImages = [...productImages]
  if (product.thumbnail) {
    orderedImages.sort((a, b) =>
      Number(b.url === product.thumbnail) - Number(a.url === product.thumbnail)
    )
  }

  if (!selectedVariantId || (product.variants?.length ?? 0) <= 1) {
    return orderedImages
  }

  const variant = product.variants?.find(
    (item) => item.id === selectedVariantId
  )

  if (!variant?.images?.length) {
    return orderedImages
  }

  const variantImageIds = new Set(
    variant.images.map((image) => image.id)
  )

  const selectedImages = orderedImages.filter(
    (image) => variantImageIds.has(image.id)
  )

  return selectedImages.length
    ? selectedImages
    : orderedImages
}

async function getProduct(
  countryCode: string,
  handle: string
) {
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      handle,
    },
  })

  return response.products?.[0] ?? null
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const { countryCode, handle } = await props.params

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProduct(countryCode, handle)

  if (!product) {
    notFound()
  }

  const title = `${product.title} | SUPPCOM`
  const description =
    product.description ||
    `Compra ${product.title} en SUPPCOM Perú.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.thumbnail
        ? [product.thumbnail]
        : [],
    },
  }
}

export default async function ProductPage(
  props: Props
) {
  const { countryCode, handle } = await props.params
  const { v_id } = await props.searchParams

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProduct(
    countryCode,
    handle
  )

  if (!product) {
    notFound()
  }

  const images = getImagesForVariant(
    product,
    v_id
  )

  return (
    <ProductTemplate
      product={product}
      region={region}
      countryCode={countryCode}
      images={images}
    />
  )
}
