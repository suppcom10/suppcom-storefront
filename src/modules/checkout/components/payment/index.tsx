"use client"
import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap, isManual } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {StripeCardContainer} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
const Payment=({cart,availablePaymentMethods}:{cart:any,availablePaymentMethods:any[]})=>{
  const activeSession=cart.payment_collection?.payment_sessions?.find((s:any)=>s.status==="pending")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const [brand,setBrand]=useState<string|null>(null)
  const [cardComplete,setCardComplete]=useState(false)
  const [selected,setSelected]=useState(activeSession?.provider_id||"")
  const params=useSearchParams(),router=useRouter(),pathname=usePathname()
  const open=params.get("step")==="payment"
  const gift=cart?.gift_cards?.length>0&&cart.total===0
  const ready=(activeSession&&cart?.shipping_methods?.length>0)||gift
  const q=useCallback((k:string,v:string)=>{const p=new URLSearchParams(params);p.set(k,v);return p.toString()},[params])
  const setMethod=async(method:string)=>{
    setError(null);setSelected(method)
    if(isStripeLike(method)){
      try{await initiatePaymentSession(cart,{provider_id:method})}catch(e:any){setError(e?.message||"No se pudo iniciar el pago")}
    }
  }
  const submit=async()=>{
    setLoading(true)
    try{
      const needsCard=isStripeLike(selected)&&!activeSession
      if(activeSession?.provider_id!==selected)await initiatePaymentSession(cart,{provider_id:selected})
      if(!needsCard)router.push(pathname+"?"+q("step","review"),{scroll:false})
    }catch(e:any){setError(e?.message||"No se pudo continuar")}
    finally{setLoading(false)}
  }
  useEffect(()=>setError(null),[open])
  const title=(id:string)=>isManual(id)?"Pago manual (transferencia por verificar)":paymentInfoMap[id]?.title||id
  const map=Object.fromEntries((availablePaymentMethods||[]).map(method=>[method.id,{title:title(method.id),icon:paymentInfoMap[method.id]?.icon||<CreditCard key={method.id}/>}]));
  return <section className="rounded-xl bg-white p-1 sm:p-4">
    <div className="mb-6 flex items-center justify-between gap-4"><Heading level="h2" className={clx("flex items-center gap-2 text-2xl font-bold",{"opacity-50":!open&&!ready})}>Método de pago {!open&&ready&&<CheckCircleSolid className="text-emerald-600"/>}</Heading>
      {!open&&ready&&<button type="button" onClick={()=>router.push(pathname+"?"+q("step","payment"),{scroll:false})} className="text-sm font-semibold text-[#E6003D]" data-testid="edit-payment-button">Editar</button>}
    </div>
    <div className={open?"block":"hidden"}>
      {!gift&&Boolean(availablePaymentMethods?.length)&&<RadioGroup value={selected} onChange={(value:string)=>void setMethod(value)}>{availablePaymentMethods.map(method=><div key={method.id}>{isStripeLike(method.id)?<StripeCardContainer paymentProviderId={method.id} selectedPaymentOptionId={selected} paymentInfoMap={map} setCardBrand={setBrand} setError={setError} setCardComplete={setCardComplete}/>:<PaymentContainer paymentProviderId={method.id} selectedPaymentOptionId={selected} paymentInfoMap={map}/>}</div>)}</RadioGroup>}
      {gift&&<Text>Tarjeta de regalo</Text>}
      {selected&&isManual(selected)&&<p className="my-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Este método no cobra automáticamente. Después de confirmar el pedido, SUPPCOM verificará el abono. No se reservará ni despachará el producto como pagado sin esa verificación.</p>}
      <ErrorMessage error={error} data-testid="payment-method-error-message"/>
      <Button size="large" className="mt-6 !bg-[#E6003D] hover:!bg-[#bd0032]" onClick={submit} isLoading={loading} disabled={(isStripeLike(selected)&&!cardComplete)||(!selected&&!gift)} data-testid="submit-payment-button">{!activeSession&&isStripeLike(selected)?"Ingresar datos de tarjeta":"Continuar a revisión"}</Button>
    </div>
    {!open&&ready&&activeSession&&<div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2"><div><Text className="font-semibold">Forma de pago</Text><Text className="text-neutral-600" data-testid="payment-method-summary">{title(activeSession.provider_id)}</Text></div><div><Text className="font-semibold">Estado</Text><Text className="text-neutral-600" data-testid="payment-details-summary">{isManual(activeSession.provider_id)?"Pendiente de verificación":isStripeLike(activeSession.provider_id)&&brand?brand:"Se confirmará en el siguiente paso"}</Text></div></div>}
    {!open&&gift&&<Text>Tarjeta de regalo</Text>}
    <Divider className="mt-8"/>
  </section>
}
export default Payment
