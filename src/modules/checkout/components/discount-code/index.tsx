"use client"
import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React from "react"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"
type DiscountCodeProps = { cart: HttpTypes.StoreCart & { promotions: HttpTypes.StorePromotion[] } }
const DiscountCode:React.FC<DiscountCodeProps>=({cart})=>{
  const [open,setOpen]=React.useState(false)
  const [error,setError]=React.useState("")
  const promotions=cart.promotions || []
  const remove=async(code:string)=>{
    try {await applyPromotions(promotions.filter(p=>p.code && p.code!==code).map(p=>p.code!))}
    catch(e:any){setError(e.message || "No se pudo quitar el cupón")}
  }
  const add=async(data:FormData)=>{
    setError("")
    const code=String(data.get("code")||"").trim()
    if(!code)return
    try {await applyPromotions([...promotions.filter(p=>p.code).map(p=>p.code!),code])}
    catch(e:any){setError(e.message || "No se pudo aplicar el cupón")}
  }
  return <div className="w-full bg-white flex flex-col">
    <form action={add} className="w-full mb-3">
      <Label className="flex gap-x-1 my-2 items-center"><button onClick={()=>setOpen(v=>!v)} type="button" className="text-sm font-medium text-[#E6003D]" data-testid="add-discount-button">¿Tienes un cupón de descuento?</button></Label>
      {open && <div className="flex w-full gap-2"><Input name="code" type="text" placeholder="Código de descuento" data-testid="discount-input"/><SubmitButton variant="secondary" data-testid="discount-apply-button">Aplicar</SubmitButton></div>}
      <ErrorMessage error={error} data-testid="discount-error-message"/>
    </form>
    {promotions.length>0 && <div><Heading className="txt-medium mb-2">Cupones aplicados</Heading>{promotions.map(p=><div key={p.id} className="flex items-center justify-between mb-2"><Text className="text-sm"><Badge size="small" color={p.is_automatic?"green":"grey"}>{p.code}</Badge>{p.application_method?.value!==undefined ? (p.application_method.type==="percentage"?` · ${p.application_method.value}%`:p.application_method.currency_code?` · ${convertToLocale({amount:Number(p.application_method.value),currency_code:p.application_method.currency_code})}`:""):""}</Text>{!p.is_automatic&&p.code&&<button type="button" onClick={()=>remove(p.code!)} aria-label="Quitar cupón"><Trash size={14}/></button>}</div>)}</div>}
  </div>
}
export default DiscountCode
