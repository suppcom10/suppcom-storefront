"use client"
import { Heading, Text, clx } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
const Review=({cart}:{cart:any})=>{
  const isOpen=useSearchParams().get("step")==="review"
  const paidByGiftcard=cart?.gift_cards?.length>0&&cart?.total===0
  const ready=cart?.shipping_address&&cart?.shipping_methods?.length>0&&(cart?.payment_collection||paidByGiftcard)
  return <div className="rounded-xl bg-white p-1 sm:p-4">
    <Heading level="h2" className={clx("mb-6 text-2xl font-bold",{"opacity-50 pointer-events-none select-none":!isOpen})}>Revisar pedido</Heading>
    {isOpen&&ready&&<><Text className="mb-5 text-sm leading-6 text-neutral-600">Verifica los productos, importes y el método de entrega. Al confirmar, crearás una solicitud de pedido. Si elegiste pago manual, SUPPCOM comprobará el abono antes de procesar la compra.</Text><PaymentButton cart={cart} data-testid="submit-order-button"/></>}
  </div>
}
export default Review
