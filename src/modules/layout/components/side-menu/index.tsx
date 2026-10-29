"use client"

import { Popover, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const hardwareCategories = [
  {
    name: "Laptops",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "PC Armadas",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm4 4h6m-6 4h6m-6 4h2" />
      </svg>
    ),
  },
  {
    name: "Procesadores (CPU)",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z" />
      </svg>
    ),
  },
  {
    name: "Placas Madre",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 3h2m-2 3h2m-2 3h2m4-6h2m-2 3h2" />
      </svg>
    ),
  },
  {
    name: "Tarjetas de Video (GPU)",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16M7 12h2m4 0h2" />
      </svg>
    ),
  },
  {
    name: "Memorias RAM",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16v12H4V6zm3 4v4m3-4v4m3-4v4m3-4v4" />
      </svg>
    ),
  },
  {
    name: "Discos Sólidos (SSD)",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 12h14M5 16h14" />
      </svg>
    ),
  },
  {
    name: "Periféricos y Accesorios",
    href: "/store",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-4-8h8" />
      </svg>
    ),
  },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

export default function SideMenu({ regions, locales, currentLocale }: SideMenuProps) {
  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-2 transition-all ease-out duration-200 focus:outline-none hover:text-[#E31837] text-neutral-800 font-semibold text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Menú
                </Popover.Button>
              </div>

              <Transition show={open} as={Fragment}>
                <div className="fixed inset-0 z-50 overflow-hidden">
                  {/* Backdrop oscurecido con blur */}
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div
                      onClick={close}
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                      aria-hidden="true"
                    />
                  </Transition.Child>

                  {/* Panel Drawer lateral */}
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-out duration-250 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in duration-200 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Popover.Panel className="fixed inset-y-0 left-0 w-full sm:w-80 md:w-96 bg-white text-neutral-900 border-r border-neutral-200 shadow-2xl overflow-y-auto">
                      <div className="flex flex-col h-full justify-between p-6">
                        <div>
                          {/* Cabecera del Drawer */}
                          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                            <img src="/logo.png" alt="SuppCom" className="h-7 w-auto object-contain" />
                            <button
                              onClick={close}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                            >
                              <XMark />
                            </button>
                          </div>

                          {/* Enlaces Principales */}
                          <div className="py-4 border-b border-neutral-100">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                              Navegación
                            </span>
                            <div className="mt-2 flex flex-col gap-1">
                              <LocalizedClientLink
                                href="/"
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                              >
                                Inicio
                              </LocalizedClientLink>
                              <LocalizedClientLink
                                href="/store"
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-[#E31837] bg-red-50 hover:bg-red-100 transition-colors"
                              >
                                Ver Todo el Catálogo
                              </LocalizedClientLink>
                            </div>
                          </div>

                          {/* Categorías de Hardware */}
                          <div className="pt-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                              Categorías de Hardware
                            </span>
                            <ul className="mt-2 flex flex-col gap-1">
                              {hardwareCategories.map((cat) => (
                                <li key={cat.name}>
                                  <LocalizedClientLink
                                    href={cat.href}
                                    onClick={close}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-[#E31837] hover:bg-red-50/60 transition-colors group"
                                  >
                                    <span className="text-neutral-400 group-hover:text-[#E31837] transition-colors">
                                      {cat.icon}
                                    </span>
                                    <span>{cat.name}</span>
                                  </LocalizedClientLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Footer del Drawer */}
                        <div className="pt-5 border-t border-neutral-100 flex flex-col gap-3 mt-6">
                          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                            <LocalizedClientLink href="/account" onClick={close} className="hover:text-neutral-900">
                              Mi Cuenta
                            </LocalizedClientLink>
                            <span>•</span>
                            <LocalizedClientLink href="/cart" onClick={close} className="hover:text-neutral-900">
                              Carrito de Compra
                            </LocalizedClientLink>
                          </div>

                          {/* Envíos Nacionales */}
                          <div className="flex items-center justify-between text-xs text-neutral-600 font-medium pt-3 border-t border-neutral-100">
                            <span className="flex items-center gap-1.5">
                              <span>🇵🇪</span> Envíos a todo el Perú
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              Lima & Provincias
                            </span>
                          </div>

                          <Text className="text-[11px] text-neutral-400 text-center">
                            © {new Date().getFullYear()} SuppCom. Todos los derechos reservados.
                          </Text>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}
