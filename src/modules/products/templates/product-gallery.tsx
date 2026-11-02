"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { TouchEvent } from "react"
import { HttpTypes } from "@medusajs/types"

type ProductGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const photos = images.filter((image) => Boolean(image.url) && !image.url.includes("blanco.jpg"))
  const activeIndex = Math.min(selected, Math.max(photos.length - 1, 0))
  const active = photos[activeIndex]

  const previousImage = () => {
    if (photos.length > 1) setSelected((current) => (current - 1 + photos.length) % photos.length)
  }
  const nextImage = () => {
    if (photos.length > 1) setSelected((current) => (current + 1) % photos.length)
  }
  const closeZoom = () => setZoomOpen(false)

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStartX.current
    touchStartX.current = null
    if (start === null || photos.length < 2) return
    const difference = event.changedTouches[0].clientX - start
    if (Math.abs(difference) > 45) {
      if (difference > 0) previousImage()
      else nextImage()
    }
  }

  useEffect(() => {
    if (!zoomOpen) return
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeZoom()
      } else if (event.key === "ArrowLeft" && photos.length > 1) {
        event.preventDefault()
        setSelected((current) => (current - 1 + photos.length) % photos.length)
      } else if (event.key === "ArrowRight" && photos.length > 1) {
        event.preventDefault()
        setSelected((current) => (current + 1) % photos.length)
      } else if (event.key === "Tab") {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])
        if (!controls.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener("keydown", onKeyDown)
      triggerRef.current?.focus()
    }
  }, [zoomOpen, photos.length])

  if (!photos.length) {
    return (
      <div className="flex aspect-[5/4] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-xs text-gray-500">
        Imagen no disponible
      </div>
    )
  }

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Ampliar fotografía del producto"
          className="relative block aspect-[5/4] w-full cursor-zoom-in overflow-hidden"
        >
          <Image
            key={active.id || active.url}
            src={active.url}
            alt={`${title} - fotografía ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            quality={85}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain p-1 transition-transform duration-300 scale-[1.32] group-hover:scale-[1.36]"
          />
        </button>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm transition-colors hover:text-[#E6003D]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-sm transition-colors hover:text-[#E6003D]"
            >
              ›
            </button>
          </>
        )}

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-gray-200 bg-white/95 px-3 py-1 text-[11px] font-bold text-gray-700">
          {activeIndex + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-3 right-3 rounded-full border border-gray-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#E6003D]"
        >
          Ampliar ↗
        </button>
      </div>

      {photos.length > 1 && (
        <div aria-label="Seleccionar fotografía" className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={photo.id || index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Seleccionar imagen ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative h-[68px] w-[78px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors ${
                index === activeIndex ? "border-[#E6003D]" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image src={photo.url} alt={`Vista ${index + 1}`} fill sizes="78px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 text-center text-[11px] text-gray-400">Selecciona una fotografía para ampliarla</p>

      {zoomOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografías de ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeZoom()
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center bg-black/90 p-3 backdrop-blur-sm small:p-5"
        >
          <div className="flex w-full max-w-6xl items-center justify-between gap-3 pb-3 text-white">
            <p className="max-w-[70%] truncate text-sm font-semibold">{title}</p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeZoom}
              aria-label="Cerrar fotografía ampliada"
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#E6003D]"
            >
              Cerrar ✕
            </button>
          </div>

          {/* Clic sobre el fondo oscuro exterior cierra; clic sobre la foto conserva el visor */}
          <div className="flex min-h-0 w-full flex-1 items-center justify-center" onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeZoom()
          }}>
            <div
              className="relative h-full w-full max-w-5xl overflow-hidden bg-white"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={active.url}
                alt={`${title} - foto ${activeIndex + 1} ampliada`}
                fill
                quality={90}
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 text-white small:gap-5">
            {photos.length > 1 && (
              <button type="button" onClick={previousImage} aria-label="Foto anterior" className="rounded-full bg-white/15 px-4 py-2 text-sm hover:bg-white/25">
                ← Anterior
              </button>
            )}
            <span className="min-w-[65px] text-center text-xs">{activeIndex + 1} de {photos.length}</span>
            {photos.length > 1 && (
              <button type="button" onClick={nextImage} aria-label="Foto siguiente" className="rounded-full bg-white/15 px-4 py-2 text-sm hover:bg-white/25">
                Siguiente →
              </button>
            )}
          </div>
          <p className="pt-2 text-center text-[11px] text-gray-300">Esc para cerrar · ← → para navegar</p>
        </div>
      )}
    </>
  )
}
