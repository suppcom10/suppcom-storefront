"use client"
import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
type Props={cart:HttpTypes.StoreCart,"data-testid":string}
const PaymentButton:React.FC<Props>=({cart,"data-testid":testId})=>{
  const notReady=!cart||!cart.shipping_address||!cart.billing_address||!cart.email||(cart.shipping_methods?.length??0)<1
  const session=cart.payment_collection?.payment_sessions?.[0]
  if(isStripeLike(session?.provider_id))return <StripePaymentButton cart={cart} notReady={notReady} testId={testId}/>
  if(isManual(session?.provider_id))return <ManualPaymentButton notReady={notReady}/>
  return <Button disabled>Selecciona un método de pago</Button>
}
const StripePaymentButton=({cart,notReady,testId}:{cart:HttpTypes.StoreCart,notReady:boolean,testId:string})=>{
  const [submitting,setSubmitting]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const stripe=useStripe(),elements=useElements(),card=elements?.getElement("card")
  const session=cart.payment_collection?.payment_sessions?.find(s=>s.status==="pending")
  const onCompleted=async()=>{try{await placeOrder()}catch(e:any){setError(e?.message||"No se pudo crear el pedido")}finally{setSubmitting(false)}}
  const pay=async()=>{
    if(!stripe||!elements||!card||!cart)return
    setSubmitting(true);setError(null)
    try{
      const {error:stripeError,paymentIntent}=await stripe.confirmCardPayment(session?.data.client_secret as string,{
        payment_method:{card,billing_details:{name:`${cart.billing_address?.first_name||""} ${cart.billing_address?.last_name||""}`.trim(),address:{city:cart.billing_address?.city??undefined,country:cart.billing_address?.country_code??undefined,line1:cart.billing_address?.address_1??undefined,line2:cart.billing_address?.address_2??undefined,postal_code:cart.billing_address?.postal_code??undefined,state:cart.billing_address?.province??undefined},email:cart.email,phone:cart.billing_address?.phone??undefined}}
      })
      const intent=paymentIntent||stripeError?.payment_intent
      if(intent?.status==="requires_capture"||intent?.status==="succeeded")await onCompleted()
      else{setError(stripeError?.message||"El pago no se completó. Verifica los datos.");setSubmitting(false)}
    }catch(e:any){setError(e?.message||"No se pudo procesar el pago");setSubmitting(false)}
  }
  return <><Button disabled={!stripe||!elements||notReady} onClick={pay} isLoading={submitting} size="large" className="!bg-[#E6003D] hover:!bg-[#bd0032]" data-testid={testId}>Confirmar pedido y procesar pago</Button><ErrorMessage error={error} data-testid="stripe-payment-error-message"/></>
}
const ManualPaymentButton=({notReady}:{notReady:boolean})=>{
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const confirm=async()=>{setLoading(true);setError(null);try{await placeOrder()}catch(e:any){setError(e?.message||"No se pudo registrar el pedido")}finally{setLoading(false)}}
  return <><p className="mb-4 text-sm leading-6 text-neutral-600">Este pedido quedará pendiente de verificación de pago. No se cargará automáticamente ninguna tarjeta ni se considerará recibido el dinero.</p><Button disabled={notReady} isLoading={loading} onClick={confirm} size="large" className="!bg-[#E6003D] hover:!bg-[#bd0032]" data-testid="submit-order-button">Confirmar pedido (pago pendiente)</Button><ErrorMessage error={error} data-testid="manual-payment-error-message"/></>
}
export default PaymentButton
