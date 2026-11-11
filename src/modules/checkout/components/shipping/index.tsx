"use client"
import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({ cart, customer }: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "address"
  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart.shipping_address, cart.billing_address)
      : true
  )
  const [message, formAction] = useActionState(setAddresses, null)
  return (
    <section className="rounded-xl bg-white p-1 sm:p-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Heading level="h2" className="flex items-center gap-2 text-2xl font-bold text-neutral-950">
          Dirección de entrega
          {!isOpen && cart?.shipping_address && <CheckCircleSolid className="text-emerald-600" />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <button onClick={() => router.push(pathname + "?step=address")} className="text-sm font-semibold text-[#E6003D] hover:underline" data-testid="edit-address-button">Editar</button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <ShippingAddress customer={customer} checked={sameAsBilling} onChange={toggleSameAsBilling} cart={cart} />
          {!sameAsBilling && <div className="pt-6"><Heading level="h2" className="pb-5 text-xl font-semibold">Dirección de facturación</Heading><BillingAddress cart={cart} /></div>}
          <SubmitButton className="mt-6 !bg-[#E6003D] hover:!bg-[#c90035]" data-testid="submit-address-button">Continuar con la entrega</SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </form>
      ) : (
        <div className="text-sm text-neutral-600">
          {cart?.shipping_address ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div data-testid="shipping-address-summary"><p className="mb-1 font-semibold text-neutral-900">Dirección</p>
                <p>{cart.shipping_address.first_name} {cart.shipping_address.last_name}</p>
                <p>{cart.shipping_address.address_1} {cart.shipping_address.address_2}</p>
                <p>{cart.shipping_address.postal_code}, {cart.shipping_address.city}</p>
                <p>{cart.shipping_address.province}</p>
                <p>{cart.shipping_address.country_code?.toUpperCase() === "PE" ? "Perú" : cart.shipping_address.country_code?.toUpperCase()}</p>
              </div>
              <div data-testid="shipping-contact-summary"><p className="mb-1 font-semibold text-neutral-900">Contacto</p><p>{cart.shipping_address.phone}</p><p>{cart.email}</p></div>
              <div data-testid="billing-address-summary"><p className="mb-1 font-semibold text-neutral-900">Facturación</p>
                {sameAsBilling ? <p>La dirección de facturación es la misma que la de entrega.</p> : <><p>{cart.billing_address?.first_name} {cart.billing_address?.last_name}</p><p>{cart.billing_address?.address_1} {cart.billing_address?.address_2}</p><p>{cart.billing_address?.city}, {cart.billing_address?.country_code?.toUpperCase()}</p></>}
              </div>
            </div>
          ) : <Spinner />}
        </div>
      )}
      <Divider className="mt-8" />
    </section>
  )
}
export default Addresses
