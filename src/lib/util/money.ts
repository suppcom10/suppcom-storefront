import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

// Importes de Medusa v2 ya están expresados en la unidad mayor de la moneda.
// PEN usa S/ para toda la tienda; otras monedas mantienen Intl.
export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) return amount.toString()

  if (currency_code.toLowerCase() === "pen") {
    const min = minimumFractionDigits ?? 2
    const max = maximumFractionDigits ?? Math.max(min, 2)
    return `S/ ${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(amount)}`
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}
