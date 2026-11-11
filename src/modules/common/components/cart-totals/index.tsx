"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    shipping_methods?: unknown[] | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, tax_total, item_subtotal, shipping_subtotal, discount_subtotal } = totals
  const money = (amount: number) => convertToLocale({ amount, currency_code })
  const hasShippingMethod = (totals.shipping_methods?.length ?? 0) > 0
  return (
    <div>
      <div className="flex flex-col gap-y-2 text-sm text-neutral-600">
        <div className="flex items-center justify-between gap-3">
          <span>Subtotal (sin envío ni IGV)</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal ?? 0} className="whitespace-nowrap">{money(item_subtotal ?? 0)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Envío</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal ?? 0} className="text-right">
            {hasShippingMethod ? (shipping_subtotal === 0 ? "Gratis" : money(shipping_subtotal ?? 0)) : "Por seleccionar"}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between gap-3">
            <span>Descuento</span>
            <span data-testid="cart-discount" data-value={discount_subtotal ?? 0}>- {money(discount_subtotal)}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <span>IGV</span>
          <span data-testid="cart-taxes" data-value={tax_total ?? 0} className="whitespace-nowrap">{money(tax_total ?? 0)}</span>
        </div>
      </div>
      <div className="my-4 h-px w-full bg-neutral-200" />
      <div className="flex items-center justify-between gap-3 text-neutral-950">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-extrabold tabular-nums" data-testid="cart-total" data-value={total ?? 0}>{money(total ?? 0)}</span>
      </div>
      {!hasShippingMethod && <p className="mt-2 text-xs text-neutral-500">El costo de envío se confirma al elegir la modalidad de entrega.</p>}
      <div className="mt-4 h-px w-full bg-neutral-200" />
    </div>
  )
}
export default CartTotals
