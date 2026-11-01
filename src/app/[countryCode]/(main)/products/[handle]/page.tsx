
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

// Las fichas se generan bajo demanda.
// No consultamos el catálogo durante el build.
export const dynamic = "force-dynamic"

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  const productImages = product.images ?? []

  if (!selectedVariantId) {
    return productImages
  }

  const variant = product.variants?.find(
    (item) => item.id === selectedVariantId
  )

  if (!variant?.images?.length) {
    return productImages
  }

  const variantImageIds = new Set(
    variant.images.map((image) => image.id)
  )

  const selectedImages = productImages.filter(
    (image) => variantImageIds.has(image.id)
  )

  return selectedImages.length
    ? selectedImages
    : productImages
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

  // Importante: validar ANTES de usar el producto.
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
