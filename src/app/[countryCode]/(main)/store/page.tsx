import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Catálogo de Productos | SuppCom",
  description: "Explora todos los productos de tecnología y componentes disponibles.",
}

type Props = {
  params: Promise<{ countryCode: string }> | { countryCode: string }
  searchParams:
    | Promise<{ sortBy?: SortOptions; page?: string; q?: string }>
    | { sortBy?: SortOptions; page?: string; q?: string }
}

export default async function StorePage(props: Props) {
  const resolvedParams = props.params instanceof Promise ? await props.params : props.params
  const resolvedSearchParams =
    props.searchParams instanceof Promise ? await props.searchParams : props.searchParams

  const countryCode = resolvedParams?.countryCode || "pe"
  const sortBy = resolvedSearchParams?.sortBy
  const page = resolvedSearchParams?.page
  const q = resolvedSearchParams?.q

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      q={q}
    />
  )
}
