import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#fafafa]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="content-container mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4">
          <LocalizedClientLink
            href="/cart"
            className="text-xs font-semibold text-neutral-600 transition-colors hover:text-[#E6003D]"
            data-testid="back-to-cart-link"
          >
            <span aria-hidden="true">← </span>
            <span className="hidden sm:inline">Volver a mi carrito</span>
            <span className="sm:hidden">Volver</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/" aria-label="Ir al inicio de SUPPCOM" data-testid="store-link">
            <img src="/logo.png" alt="SUPPCOM" className="h-9 w-auto object-contain" />
          </LocalizedClientLink>
          <span className="hidden text-xs font-medium text-emerald-700 sm:block">
            Compra protegida
          </span>
          <span className="w-8 sm:hidden" aria-hidden="true" />
        </div>
      </header>
      <main data-testid="checkout-container">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-neutral-500">
        © SUPPCOM Perú · Atención y confirmación de pedidos
      </footer>
    </div>
  )
}
