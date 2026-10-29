import { retrieveCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)
  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <LocalizedClientLink
      className="relative flex items-center justify-center p-2 rounded-lg text-neutral-700 hover:text-[#E31837] hover:bg-neutral-50 transition-colors"
      href="/cart"
      data-testid="nav-cart-link"
    >
      {/* Icono de bolsa/carrito SVG */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Badge numérico compacto si hay productos */}
      {totalItems > 0 ? (
        <span className="absolute -top-1 -right-1 bg-[#E31837] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
          {totalItems}
        </span>
      ) : (
        <span className="text-xs font-semibold text-neutral-500 ml-1.5">
          (0)
        </span>
      )}
    </LocalizedClientLink>
  )
}
