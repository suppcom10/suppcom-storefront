import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({variant, "data-testid": dataTestid, "data-value": dataValue}: LineItemOptionsProps) => {
  const title = variant?.title?.trim()
  if (!title || ["default", "default variant", "unidad"].includes(title.toLowerCase())) return null
  return <Text data-testid={dataTestid} data-value={dataValue} className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">Presentación: {title}</Text>
}
export default LineItemOptions
