import { VariantPrice } from "types/global"

function formatPrice(amount: number, currencyCode: string, fallback: string): string {
  if (currencyCode?.toLowerCase() === "pen" && Number.isFinite(amount)) {
    return `S/ ${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`
  }
  return fallback
}

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) return null

  const hasRealDiscount =
    price.price_type === "sale" &&
    Number.isFinite(price.original_price_number) &&
    Number.isFinite(price.calculated_price_number) &&
    price.original_price_number > price.calculated_price_number

  const currentPrice = formatPrice(
    price.calculated_price_number,
    price.currency_code,
    price.calculated_price
  )
  const previousPrice = formatPrice(
    price.original_price_number,
    price.currency_code,
    price.original_price
  )

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {hasRealDiscount && (
        <span
          className="text-xs font-medium text-neutral-400 line-through"
          data-testid="original-price"
        >
          {previousPrice}
        </span>
      )}
      <span
        className={`block whitespace-nowrap text-[18px] font-extrabold leading-tight tracking-tight sm:text-[20px] ${
          hasRealDiscount ? "text-[#E6003D]" : "text-neutral-950"
        }`}
        data-testid="price"
      >
        {currentPrice}
      </span>
    </div>
  )
}
