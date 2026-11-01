
"use client"

import { useState } from "react"
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

  const photos = images.filter((image) => Boolean(image.url))
  const activeIndex = Math.min(selected, Math.max(photos.length - 1, 0))
  const active = photos[activeIndex]

  const previousImage = () => {
    setSelected((current) =>
      (current - 1 + photos.length) % photos.length
    )
  }

  const nextImage = () => {
    setSelected((current) =>
      (current + 1) % photos.length
    )
  }

  if (!photos.length) {
    return (
      <div className="flex aspect-[5/4] items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-400">
        Imagen no disponible
      </div>
    )
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <button
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
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.035] small:p-6"
          />
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-600 shadow-sm">
          {activeIndex + 1} / {photos.length}
        </span>

        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Ver imagen ampliada"
          className="absolute bottom-3 right-3 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-[#E6003D] hover:text-[#E6003D]"
        >
          Ampliar ↗
        </button>
      </div>

      {/* Miniaturas interactivas */}
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id || index}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Seleccionar imagen ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative h-[72px] w-[82px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                index === activeIndex
                  ? "border-[#E6003D]"
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

      {/* Ventana de ampliación */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada del producto"
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4"
        >
          <div className="flex items-center justify-between gap-4 text-white">
            <p className="max-w-[75%] truncate text-sm font-semibold">
              {title}
            </p>

            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Cerrar imagen ampliada"
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
            >
              Cerrar ✕
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              src={active.url}
              alt={`${title} ampliada`}
              fill
              sizes="100vw"
              quality={90}
              className="object-contain p-3"
            />
          </div>

          <div className="flex items-center justify-center gap-5 py-3 text-white">
            {photos.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                className="rounded-full bg-white/15 px-5 py-2 hover:bg-white/25"
                aria-label="Imagen anterior"
              >
                ←
              </button>
            )}

            <span className="text-sm">
              {activeIndex + 1} de {photos.length}
            </span>

            {photos.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                className="rounded-full bg-white/15 px-5 py-2 hover:bg-white/25"
                aria-label="Imagen siguiente"
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
