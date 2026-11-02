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
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const photos = images.filter(
    (image) => Boolean(image.url) && !image.url.includes("blanco.jpg")
  )

  const activeIndex = Math.min(selected, Math.max(photos.length - 1, 0))
  const active = photos[activeIndex]

  const previousImage = () => {
    if (photos.length < 2) return
    setSelected((current) => (current - 1 + photos.length) % photos.length)
  }

  const nextImage = () => {
    if (photos.length < 2) return
    setSelected((current) => (current + 1) % photos.length)
  }

  const closeZoom = () => {
    setZoomOpen(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || photos.length < 2) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) previousImage()
      else nextImage()
    }
    setTouchStartX(null)
  }

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
        setSelected((current) => (current - 1 + photos.length) % photos.length)
      }
      if (event.key === "ArrowRight" && photos.length > 1) {
        event.preventDefault()
        setSelected((current) => (current + 1) % photos.length)
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
      <div className="flex aspect-[5/4] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <svg
          className="mb-2 h-10 w-10 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path strokeLinecap="round" d="M8 21h8m-4-3v3" />
        </svg>
        <p className="text-xs font-semibold text-gray-500">
          Imagen referencial en actualización
        </p>
        <p className="mt-0.5 text-[11px] text-gray-400">
          Producto original sellado · SUPPCOM Perú
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Visor Principal con soporte táctil y flechas rápidas */}
      <div
        className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Ampliar fotografía del producto"
          className="relative block aspect-[5/4] w-full cursor-zoom-in"
        >
          <Image
            key={active.id || active.url}
            src={active.url}
            alt={`${title} - fotografía ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            quality={85}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03] small:p-6"
          />
        </button>

        {/* Flechas laterales al pasar el mouse */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Imagen anterior"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 opacity-0 shadow-sm transition-all hover:border-[#E6003D] hover:text-[#E6003D] group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Imagen siguiente"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 opacity-0 shadow-sm transition-all hover:border-[#E6003D] hover:text-[#E6003D] group-hover:opacity-100"
            >
              ›
            </button>
          </>
        )}

        {/* Contador inferior izquierdo */}
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-gray-200/80 bg-white/95 px-3 py-1 text-[11px] font-bold text-gray-700 shadow-xs">
          {activeIndex + 1} / {photos.length}
        </span>

        {/* Botón Ampliar */}
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-[#E6003D] hover:text-[#E6003D]"
        >
          <span>Ampliar</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      {/* Tira de Miniaturas */}
      {photos.length > 1 && (
        <div
          aria-label="Seleccionar fotografía"
          className="mt-3 flex gap-2.5 overflow-x-auto pb-1 pt-1"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.id || index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Seleccionar imagen ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative h-[68px] w-[78px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                index === activeIndex
                  ? "border-[#E6003D] ring-2 ring-[#E6003D]/15"
                  : "border-gray-200 opacity-75 hover:border-gray-400 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.url}
                alt={`Vista ${index + 1}`}
                fill
                sizes="78px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}

      <p className="mt-2.5 text-center text-[11px] text-gray-400">
        Haz clic en la imagen para hacer zoom en alta resolución
      </p>

      {/* Modal de Pantalla Completa */}
      {zoomOpen && (
        <div
          id="suppcom-photo-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografías de ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeZoom()
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/92 p-4 backdrop-blur-xs small:p-6"
        >
          {/* Cabecera del Modal */}
          <div
            className="flex w-full max-w-6xl items-center justify-between gap-4 text-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="max-w-[75%] truncate text-sm font-semibold text-gray-200">
              {title}
            </p>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeZoom}
              aria-label="Cerrar visor de fotografías"
              className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#E6003D]"
            >
              Cerrar ✕
            </button>
          </div>

          {/* Imagen Central */}
          <div
            className="relative my-4 min-h-0 w-full max-w-5xl flex-1"
            onMouseDown={(event) => event.stopPropagation()}
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

          {/* Controles Inferiores del Modal */}
          <div
            className="flex flex-col items-center gap-3 text-white"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-5">
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Imagen anterior"
                  className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold transition-colors hover:bg-white/30"
                >
                  ← Anterior
                </button>
              )}

              <span className="min-w-[80px] text-center text-xs font-semibold text-gray-300">
                Foto {activeIndex + 1} de {photos.length}
              </span>

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Imagen siguiente"
                  className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold transition-colors hover:bg-white/30"
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
