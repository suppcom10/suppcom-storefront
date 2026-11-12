import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
const ShippingDetails=({order}:{order:HttpTypes.StoreOrder})=>{
  const method=order.shipping_methods?.[0]
  return <section>
    <Heading level="h2" className="my-6 text-2xl font-bold">Entrega</Heading>
    <div className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-3">
      <div data-testid="shipping-address-summary"><Text className="font-semibold mb-1">Dirección</Text><Text>{order.shipping_address?.first_name} {order.shipping_address?.last_name}</Text><Text>{order.shipping_address?.address_1} {order.shipping_address?.address_2}</Text><Text>{order.shipping_address?.postal_code}, {order.shipping_address?.city}</Text><Text>{order.shipping_address?.country_code?.toLowerCase()==="pe"?"Perú":order.shipping_address?.country_code?.toUpperCase()}</Text></div>
      <div data-testid="shipping-contact-summary"><Text className="font-semibold mb-1">Contacto</Text><Text>{order.shipping_address?.phone}</Text><Text>{order.email}</Text></div>
      <div data-testid="shipping-method-summary"><Text className="font-semibold mb-1">Método</Text><Text>{method?.name||"Por confirmar"}</Text><Text>{method?convertToLocale({amount:method.total??0,currency_code:order.currency_code}):"Pendiente"}</Text></div>
    </div><Divider className="mt-8"/>
  </section>
}
export default ShippingDetails
