"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"
import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()
  const price = getProductPrice({ product, variantId: variant?.id })
  const selectedPrice = useMemo(() => {
    if (!price) return null
    return price.variantPrice || price.cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)
  const metadataTitle = product.metadata?.suppcom_title
  // Conservar el título original del proveedor en Medusa para la sincronización.
  // Mostrar al cliente solo el modelo comercial, sin códigos separados por '/'.
  const commercialTitle =
    (typeof metadataTitle === "string" && metadataTitle.trim()) ||
    (product.title || "Producto SUPPCOM").split("/")[0].trim()

  return (
    <>
      {/* Ocultar únicamente el WhatsApp flotante global cuando aparece esta barra.
          El enlace WhatsApp de la ficha permanece disponible. */}
      <style>{`
        @media (max-width: 1023px) {
          body:has([data-suppcom-mobile-bar="true"]) a[aria-label="Contacto por WhatsApp"] {
            display: none !important;
          }
        }
      `}</style>

      <div
        data-suppcom-mobile-bar={show ? "true" : "false"}
        className={clx("lg:hidden fixed inset-x-0 bottom-0 z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0 translate-y-3"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-3"
        >
          <div
            className="w-full border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            data-testid="mobile-actions"
          >
            <div className="mx-auto flex max-w-xl items-center justify-between gap-3 pb-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-gray-900" data-testid="mobile-title" title={commercialTitle}>
                  {commercialTitle}
                </p>
                {product.subtitle && (
                  <p className="truncate text-[10px] text-gray-500">{product.subtitle}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                {selectedPrice ? (
                  <>
                    {selectedPrice.price_type === "sale" && (
                      <p className="text-[10px] text-gray-400 line-through">
                        {selectedPrice.original_price}
                      </p>
                    )}
                    <p className="text-sm font-extrabold text-[#171717] tabular-nums">
                      {selectedPrice.calculated_price}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-500">Consultar precio</p>
                )}
              </div>
            </div>

            <div className={clx("grid w-full gap-2", isSimple ? "grid-cols-1" : "grid-cols-2")}>
              {!isSimple && (
                <Button
                  onClick={open}
                  variant="secondary"
                  className="w-full min-w-0 h-10 text-xs"
                  data-testid="mobile-actions-button"
                >
                  <span className="flex w-full min-w-0 items-center justify-between gap-1">
                    <span className="truncate">
                      {variant
                        ? Object.values(options).filter(Boolean).join(" / ") || "Opciones"
                        : "Elegir opción"}
                    </span>
                    <ChevronDown />
                  </span>
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant || optionsDisabled}
                className="h-10 w-full bg-[#242424] text-white hover:bg-[#111111]"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant ? "Elegir variante" : !inStock ? "Agotado" : "Añadir al carrito"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>

      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700/75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel
                  className="flex h-full w-full transform flex-col gap-y-3 overflow-hidden text-left"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex w-full justify-end pr-6">
                    <button
                      onClick={close}
                      aria-label="Cerrar selección de opciones"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-10">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => (
                          <div key={option.id}>
                            <OptionSelect
                              option={option}
                              current={options[option.id]}
                              updateOption={updateOptions}
                              title={option.title ?? ""}
                              disabled={optionsDisabled}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
