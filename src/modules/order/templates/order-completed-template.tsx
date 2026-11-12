import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
type Props={order:HttpTypes.StoreOrder}
export default async function OrderCompletedTemplate({order}:Props){
  const cookies=await nextCookies()
  const isOnboarding=cookies.get("_medusa_onboarding")?.value==="true"
  return <div className="py-8 min-h-[calc(100vh-64px)]">
    <div className="content-container flex flex-col items-center gap-y-8 max-w-4xl w-full">
      {isOnboarding&&<OnboardingCta orderId={order.id}/>}
      <div className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-8 sm:px-10" data-testid="order-complete-container">
        <Heading level="h1" className="mb-3 text-3xl font-bold text-neutral-950">¡Recibimos tu pedido!</Heading>
        <p className="mb-6 text-sm text-neutral-600">Tu pedido se registró correctamente. SUPPCOM confirmará su disponibilidad y, si elegiste pago manual, verificará el abono antes de procesarlo.</p>
        <OrderDetails order={order}/>
        <Heading level="h2" className="my-6 text-2xl font-bold">Resumen de compra</Heading>
        <Items order={order}/><CartTotals totals={order}/><ShippingDetails order={order}/><PaymentDetails order={order}/><Help/>
      </div>
    </div>
  </div>
}
