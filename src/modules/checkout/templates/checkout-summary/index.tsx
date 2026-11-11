import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => (
  <aside className="sticky top-5 flex flex-col-reverse gap-y-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm small:flex-col small:p-6">
    <div className="flex w-full flex-col">
      <Divider className="my-5 small:hidden" />
      <Heading level="h2" className="text-xl font-bold text-neutral-950">
        Resumen de tu compra
      </Heading>
      <Divider className="my-4" />
      <CartTotals totals={cart} />
      <ItemsPreviewTemplate cart={cart} />
      <div className="my-5">
        <DiscountCode cart={cart} />
      </div>
      <p className="border-t border-neutral-100 pt-4 text-xs leading-5 text-neutral-500">
        La confirmación y disponibilidad del pedido se gestionan con SUPPCOM Perú.
      </p>
    </div>
  </aside>
)

export default CheckoutSummary
