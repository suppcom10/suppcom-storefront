"use client"
import { Button, Heading } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
type SummaryProps = { cart: HttpTypes.StoreCart & { promotions: HttpTypes.StorePromotion[] } }
function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) return "address"
  if (cart?.shipping_methods?.length === 0) return "delivery"
  return "payment"
}
const Summary=({cart}:SummaryProps)=> <div className="flex flex-col gap-y-4">
  <Heading level="h2" className="text-[2rem] leading-[2.75rem]">Resumen de compra</Heading>
  <DiscountCode cart={cart}/><Divider/><CartTotals totals={cart}/>
  <LocalizedClientLink href={"/checkout?step="+getCheckoutStep(cart)} data-testid="checkout-button">
    <Button className="w-full h-11 !bg-[#E6003D] hover:!bg-[#bd0032]">Continuar con mi compra</Button>
  </LocalizedClientLink>
  <p className="text-xs leading-5 text-neutral-500">Disponibilidad y entrega sujetas a confirmación de SUPPCOM. Ningún pago manual se considera recibido sin verificación.</p>
</div>
export default Summary
