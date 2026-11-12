"use client"
import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}
const Shipping: React.FC<ShippingProps> = ({cart,availableShippingMethods}) => {
  const router=useRouter()
  const pathname=usePathname()
  const isOpen=useSearchParams().get("step")==="delivery"
  const [selected,setSelected]=useState<string|null>(cart.shipping_methods?.at(-1)?.shipping_option_id||null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const [calculated,setCalculated]=useState<Record<string,number>>({})
  const [loadingPrices,setLoadingPrices]=useState(false)
  const methods=availableShippingMethods||[]
  useEffect(()=>{
    let cancelled=false
    const dynamic=methods.filter(m=>m.price_type==="calculated")
    if(!dynamic.length){setLoadingPrices(false);return}
    setLoadingPrices(true)
    Promise.allSettled(dynamic.map(m=>calculatePriceForShippingOption(m.id,cart.id)))
      .then(results=>{
        if(cancelled)return
        const map:Record<string,number>={}
        for(const result of results){if(result.status==="fulfilled"&&result.value?.id&&typeof result.value.amount==="number")map[result.value.id]=result.value.amount}
        setCalculated(map)
      }).finally(()=>{if(!cancelled)setLoadingPrices(false)})
    return ()=>{cancelled=true}
  },[cart.id,availableShippingMethods])
  const select=async(id:string)=>{
    setError(null);setLoading(true)
    const old=selected;setSelected(id)
    try{await setShippingMethod({cartId:cart.id,shippingMethodId:id})}
    catch(e:any){setSelected(old);setError(e?.message||"No se pudo seleccionar la entrega")}
    finally{setLoading(false)}
  }
  const money=(value:number)=>convertToLocale({amount:value,currency_code:cart.currency_code})
  const pickup=(m:HttpTypes.StoreCartShippingOption)=>m.service_zone?.fulfillment_set?.type==="pickup" || /recojo|recoger|retiro|pickup/i.test(m.name)
  const shippingSelected=cart.shipping_methods?.at(-1)
  const current=methods.find(m=>m.id===selected)
  return <section className="rounded-xl bg-white p-1 sm:p-4">
    <div className="mb-6 flex items-center justify-between gap-3">
      <Heading level="h2" className={clx("flex items-center gap-2 text-2xl font-bold text-neutral-950",{"opacity-50":!isOpen&&!shippingSelected})}>
        Método de entrega {!isOpen&&shippingSelected&&<CheckCircleSolid className="text-emerald-600"/>}
      </Heading>
      {!isOpen&&cart.shipping_address&&cart.billing_address&&cart.email&&<button type="button" onClick={()=>router.push(pathname+"?step=delivery",{scroll:false})} className="text-sm font-semibold text-[#E6003D]" data-testid="edit-delivery-button">Editar</button>}
    </div>
    {isOpen ? <>
      <p className="mb-4 text-sm text-neutral-500">¿Cómo quieres recibir tu pedido? Selecciona una opción.</p>
      <RadioGroup value={selected} onChange={(id:string)=>{if(id&&!loading)void select(id)}}>
        <div className="space-y-3" data-testid="delivery-options-container">
          {methods.map(option=>{
            const unavailable=Boolean(option.insufficient_inventory) || (option.price_type==="calculated"&&!loadingPrices&&typeof calculated[option.id]!=="number")
            const price=option.price_type==="flat"?option.amount:calculated[option.id]
            const isPickup=pickup(option)
            return <Radio key={option.id} value={option.id} disabled={unavailable||loading} data-testid="delivery-option-radio"
              className={clx("flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:border-[#E6003D]",{"border-2 border-[#E6003D] bg-rose-50/30":selected===option.id,"border-neutral-200":selected!==option.id,"opacity-50 cursor-not-allowed":unavailable})}>
              <span className="flex min-w-0 items-center gap-3"><span className={clx("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",selected===option.id?"border-[#E6003D]":"border-neutral-300")}>{selected===option.id&&<span className="h-2 w-2 rounded-full bg-[#E6003D]"/>}</span><span><span className="block font-semibold text-neutral-950">{option.name}</span><span className="mt-1 block text-xs text-neutral-500">{isPickup?"Retira tu pedido cuando SUPPCOM confirme que está listo.":"Despacho sujeto a cobertura y confirmación de entrega."}</span></span></span>
              <span className="shrink-0 text-sm font-bold text-neutral-950">{option.price_type==="calculated"&&loadingPrices?<Loader/>:typeof price==="number"?(price===0?"Gratis":money(price)):"Por cotizar"}</span>
            </Radio>
          })}
        </div>
      </RadioGroup>
      {!methods.length&&<p className="text-sm text-amber-700">No hay opciones de entrega configuradas para esta dirección.</p>}
      <ErrorMessage error={error} data-testid="delivery-option-error-message"/>
      <Button size="large" className="mt-6 !bg-[#E6003D] hover:!bg-[#bd0032]" onClick={()=>router.push(pathname+"?step=payment",{scroll:false})} disabled={loading||!shippingSelected||shippingSelected.shipping_option_id!==selected} data-testid="submit-delivery-option-button">Continuar al pago</Button>
      <p className="mt-3 text-xs text-neutral-500">Las tarifas indicadas corresponden a los métodos actualmente configurados en SUPPCOM.</p>
    </> : shippingSelected ? <div className="text-sm text-neutral-600"><Text className="mb-1 font-semibold text-neutral-900">Opción seleccionada</Text><Text>{shippingSelected.name} · {shippingSelected.amount===0?"Gratis":money(shippingSelected.amount??0)}</Text></div>:<p className="text-sm text-neutral-400">Completa la dirección para seleccionar el método de entrega.</p>}
    <Divider className="mt-8"/>
  </section>
}
export default Shipping
