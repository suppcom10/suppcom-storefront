import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBar from "@modules/layout/components/search-bar"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Barra de anuncios superior */}
      <div className="bg-neutral-950 text-neutral-300 text-[11px] sm:text-xs py-2 px-4 border-b border-neutral-800">
        <div className="content-container flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Mensaje principal */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-white">
              Envíos rápidos a todo Lima y provincias
            </span>
            <span className="hidden md:inline text-neutral-500">•</span>
            <span className="hidden md:inline text-neutral-400">
              Emitimos Boleta y Factura Electrónica
            </span>
          </div>

          {/* Acceso rápido a atención / WhatsApp */}
          <div className="flex items-center gap-4 text-neutral-400">
            <span className="hidden sm:inline">Garantía local y soporte técnico</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <a
              href="https://wa.me/51941325886?text=Hola%20SuppCom,%20deseo%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Atención WhatsApp</span>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.004 2C6.479 2 2 6.479 2 12.004c0 1.954.563 3.778 1.536 5.32L2.05 22l4.821-1.455c1.488.887 3.23 1.459 5.133 1.459 5.525 0 10.004-4.479 10.004-10.004C22.008 6.479 17.529 2 12.004 2zm.004 18.257c-1.637 0-3.153-.483-4.436-1.314l-.318-.207-2.868.866.865-2.802-.216-.333a8.212 8.212 0 0 1-1.278-4.463c0-4.557 3.708-8.265 8.251-8.265 4.542 0 8.25 3.708 8.25 8.265 0 4.557-3.708 8.25-8.25 8.25zm4.526-6.179c-.248-.124-1.467-.724-1.695-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.187-.538.062a6.792 6.792 0 0 1-1.996-1.231 7.485 7.485 0 0 1-1.381-1.721c-.145-.248-.016-.382.108-.506.111-.111.248-.29.373-.435.124-.145.166-.248.249-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.848-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.248-.87 0.85-.87 2.073s.891 2.404 1.016 2.57c.124.166 1.753 2.677 4.248 3.754.593.256 1.056.409 1.417.524.596.19 1.138.163 1.567.099.479-.072 1.467-.6 1.674-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.476-.29z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header className="relative h-16 mx-auto border-b bg-white/95 backdrop-blur-md border-neutral-200">
        <nav className="content-container flex items-center justify-between w-full h-full px-4 max-w-7xl mx-auto gap-4">
          
          {/* Lado izquierdo: Botón Menú + Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            
            <LocalizedClientLink
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
              data-testid="nav-store-link"
            >
              <img
                src="/logo.png"
                alt="SuppCom"
                className="h-8 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>

          {/* Centro: Barra de Búsqueda amplia */}
          <div className="hidden md:flex flex-1 justify-center max-w-lg mx-auto">
            <SearchBar />
          </div>

          {/* Lado derecho: Mi Cuenta y Carrito */}
          <div className="flex items-center gap-x-5 shrink-0 justify-end">
            <div className="hidden sm:flex items-center text-xs font-semibold text-neutral-700">
              <LocalizedClientLink
                className="hover:text-[#E31837] transition-colors"
                href="/account"
                data-testid="nav-account-link"
              >
                Mi Cuenta
              </LocalizedClientLink>
            </div>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-[#E31837] text-xs font-semibold flex items-center gap-1.5 text-neutral-800 transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrito (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>

        </nav>
      </header>
    </div>
  )
}
