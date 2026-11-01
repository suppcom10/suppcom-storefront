
"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type ProductGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

export default function ProductGallery({
  images,
  title,
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const photos = images.filter((image) => Boolean(image.url))

  const activeIndex = Math.min(
    selected,
    Math.max(photos.length - 1, 0)
  )

  const active = photos[activeIndex]

  const previousImage = () => {
    if (photos.length < 2) return

    setSelected((current) =>
      (current - 1 + photos.length) % photos.length
    )
  }

  const nextImage = () => {
    if (photos.length < 2) return

    setSelected((current) =>
      (current + 1) % photos.length
    )
  }

  const closeZoom = () => {
    setZoomOpen(false)
  }

  // Cerrar con ESC y navegar con flechas del teclado.
  // Impide que la página se desplace detrás del modal.
  useEffect(() => {
    if (!zoomOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setZoomOpen(false)
      }

      if (event.key === "ArrowLeft" && photos.length > 1) {
        event.preventDefault()
        setSelected((current) =>
          (current - 1 + photos.length) % photos.length
        )
      }

      if (event.key === "ArrowRight" && photos.length > 1) {
        event.preventDefault()
        setSelected((current) =>
          (current + 1) % photos.length
        )
      }

      // Mantener el foco dentro del visor.
      if (event.key === "Tab") {
        const dialog = document.getElementById(
          "suppcom-photo-dialog"
        )

        if (!dialog) return

        const buttons = Array.from(
          dialog.querySelectorAll<HTMLButtonElement>(
            'button:not([disabled])'
          )
        )

        if (!buttons.length) return

        const first = buttons[0]
        const last = buttons[buttons.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [zoomOpen, photos.length])

  if (!photos.length) {
    return (
      <div className="flex aspect-[5/4] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-400">
        Imagen no disponible
      </div>
    )
  }

  return (
    <>
      {/* Imagen principal */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Ampliar fotografía del producto"
          className="group relative block aspect-[5/4] w-full cursor-zoom-in"
        >
          <Image
            key={active.id || active.url}
            src={active.url}
            alt={`${title} - fotografía ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            quality={85}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.025] small:p-6"
          />
        </button>

        {/* Contador */}
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-gray-100 bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-600 shadow-sm">
          {activeIndex + 1} / {photos.length}
        </span>

        {/* Ampliar */}
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-3 right-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:border-[#E6003D] hover:text-[#E6003D]"
        >
          Ampliar ↗
        </button>
      </div>

      {/* Miniaturas */}
      {photos.length > 1 && (
        <div
          aria-label="Seleccionar fotografía"
          className="mt-3 flex gap-2 overflow-x-auto pb-2"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.id || index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Seleccionar imagen ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative h-[72px] w-[82px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                index === activeIndex
                  ? "border-[#E6003D] shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={photo.url}
                alt={`Vista ${index + 1}`}
                fill
                sizes="82px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}

      {/* Visor ampliado */}
      {zoomOpen && (
        <div
          id="suppcom-photo-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografías de ${title}`}
          onMouseDown={(event) => {
            // Clic directo en el fondo: cerrar.
            // Clic dentro de la foto: mantener abierto.
            if (event.target === event.currentTarget) {
              closeZoom()
            }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-3 small:p-6"
        >
          {/* Cabecera */}
          <div
            className="flex w-full max-w-5xl items-center justify-between gap-4 pb-3 text-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="max-w-[70%] truncate text-sm font-semibold">
              {title}
            </p>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeZoom}
              aria-label="Cerrar visor de fotografías"
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              Cerrar ✕
            </button>
          </div>

          {/* Área de fotografía */}
          <div
            className="relative min-h-0 w-full max-w-5xl flex-1"
            onMouseDown={(event) => {
              // Solo el área central del visor retiene el clic.
              // El fondo exterior sí permite cerrar.
              event.stopPropagation()
            }}
          >
            <Image
              src={active.url}
              alt={`${title} - imagen ampliada ${activeIndex + 1}`}
              fill
              quality={90}
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Navegación */}
          <div
            className="flex items-center justify-center gap-5 pt-4 text-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {photos.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                aria-label="Imagen anterior"
                className="rounded-full bg-white/15 px-5 py-2 transition-colors hover:bg-white/25"
              >
                ←
              </button>
            )}

            <span className="min-w-[70px] text-center text-sm">
              {activeIndex + 1} de {photos.length}
            </span>

            {photos.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                aria-label="Imagen siguiente"
                className="rounded-full bg-white/15 px-5 py-2 transition-colors hover:bg-white/25"
              >
                →
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] text-gray-400">
            Presiona Esc para cerrar · Usa ← → para cambiar
          </p>
        </div>
      )}
    </>
  )
}
