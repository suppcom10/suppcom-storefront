import { Heading, Text } from "@medusajs/ui"
import { isManual, isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
type Props={order:HttpTypes.StoreOrder}
const PaymentDetails=({order}:Props)=>{
  const payment=order.payment_collections?.[0]?.payments?.[0]
  const provider=payment?.provider_id||""
  const manual=isManual(provider)
  const captured=order.payment_status==="captured" || order.payment_status==="partially_captured"
  const fullyPaid=order.payment_status==="captured"
  return <section>
    <Heading level="h2" className="my-6 text-2xl font-bold">Pago</Heading>
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <Text className="mb-1 text-sm font-semibold">Método: {manual?"Pago manual (sujeto a verificación)":paymentInfoMap[provider]?.title||"Método de pago"}</Text>
      {manual ? <Text className="text-sm text-neutral-600">{fullyPaid?"Pago registrado por SUPPCOM.":captured?"Pago registrado parcialmente. SUPPCOM confirmará el saldo.":"Pago pendiente de verificación. No realices envíos ni consideres este pedido pagado hasta confirmar el abono."}</Text> : <Text className="text-sm text-neutral-600">{fullyPaid?"Pago registrado.":"Estado del pago pendiente de confirmación."}</Text>}
      {payment&&<Text className="mt-2 text-sm text-neutral-600">Importe del pedido: {convertToLocale({amount:order.total,currency_code:order.currency_code})}</Text>}
      {isStripeLike(provider)&&payment?.data?.card_last4&&<Text className="text-sm text-neutral-600">Tarjeta terminada en {String(payment.data.card_last4)}</Text>}
    </div><Divider className="mt-8"/>
  </section>
}
export default PaymentDetails
