"use client"

import { Popover, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
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

const SideMenu = ({ regions }: SideMenuProps) => {
  const countryToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-1.5 transition-all ease-out duration-200 focus:outline-none hover:text-red-600 text-neutral-800 font-semibold text-sm"
                >
                  <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Menú
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <Popover.Panel className="flex flex-col fixed w-full sm:w-80 md:w-96 h-screen z-50 inset-y-0 left-0 bg-[#141517] text-white shadow-2xl overflow-y-auto">
                  <div className="flex flex-col h-full justify-between p-6">
                    <div>
                      {/* Cabecera del Drawer */}
                      <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
                        <div className="bg-white px-2.5 py-1 rounded-md">
                          <img src="/logo.png" alt="SuppCom" className="h-6 w-auto object-contain" />
                        </div>
                        <button
                          onClick={close}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        >
                          <XMark />
                        </button>
                      </div>

                      {/* Enlaces Principales */}
                      <div className="py-4 border-b border-neutral-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Navegación
                        </span>
                        <div className="mt-2 flex flex-col gap-1">
                          <LocalizedClientLink
                            href="/"
                            onClick={close}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800/60 transition-colors"
                          >
                            Inicio
                          </LocalizedClientLink>
                          <LocalizedClientLink
                            href="/store"
                            onClick={close}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                          >
                            Ver Todo el Catálogo
                          </LocalizedClientLink>
                        </div>
                      </div>

                      {/* Lista de Categorías de Hardware */}
                      <div className="pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Categorías de Hardware
                        </span>
                        <ul className="mt-2 flex flex-col gap-1">
                          {hardwareCategories.map((cat) => (
                            <li key={cat.name}>
                              <LocalizedClientLink
                                href={cat.href}
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors group"
                              >
                                <span className="text-neutral-400 group-hover:text-red-500 transition-colors">
                                  {cat.icon}
                                </span>
                                <span>{cat.name}</span>
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer del Menú */}
                    <div className="pt-6 border-t border-neutral-800 flex flex-col gap-3 mt-6">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <LocalizedClientLink href="/account" onClick={close} className="hover:text-white">
                          Mi Cuenta
                        </LocalizedClientLink>
                        <span>•</span>
                        <LocalizedClientLink href="/cart" onClick={close} className="hover:text-white">
                          Carrito de Compra
                        </LocalizedClientLink>
                      </div>

                      <div
                        className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-neutral-800/60"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        <span>Envíos a:</span>
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state && "-rotate-90"
                          )}
                        />
                      </div>

                      <Text className="text-[11px] text-neutral-500 text-center">
                        © {new Date().getFullYear()} SuppCom. Todos los derechos reservados.
                      </Text>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
