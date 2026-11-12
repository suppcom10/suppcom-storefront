import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
type Props={order:HttpTypes.StoreOrder,showStatus?:boolean}
const labels:Record<string,string>={not_fulfilled:"Pendiente de preparación",fulfilled:"Entregado a transporte",canceled:"Cancelado",authorized:"Pago por verificar",captured:"Pago registrado",not_paid:"Pago pendiente",awaiting:"Pendiente"}
const OrderDetails=({order,showStatus}:Props)=> <div className="text-sm text-neutral-600">
  <Text>Correo de contacto: <strong data-testid="order-email">{order.email}</strong></Text>
  <Text className="mt-2">Fecha del pedido: <span data-testid="order-date">{new Date(order.created_at).toLocaleDateString("es-PE",{year:"numeric",month:"long",day:"numeric"})}</span></Text>
  <Text className="mt-2 font-semibold text-[#E6003D]">Número de pedido: <span data-testid="order-id">#{order.display_id}</span></Text>
  {showStatus&&<div className="mt-3 space-y-1"><Text>Preparación: <span data-testid="order-status">{labels[order.fulfillment_status]||order.fulfillment_status}</span></Text><Text>Pago: <span data-testid="order-payment-status">{labels[order.payment_status]||order.payment_status}</span></Text></div>}
</div>
export default OrderDetails
