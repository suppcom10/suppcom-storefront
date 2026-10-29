"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductItem = {
  id: string
  title: string
  description: string
  handle: string
  category: string
  thumbnail?: string
}

const CATALOG: ProductItem[] = [
  {
    id: "prod_lenovo",
    title: "Laptop Lenovo",
    description: "Intel Core i5, 8GB RAM, 512GB SSD, Pantalla 15.6 FHD",
    handle: "laptop-lenovo",
    category: "Laptops",
    thumbnail: "/images/banner-laptop.png",
  },
  {
    id: "prod_amd",
    title: "Procesador AMD Ryzen 5 5600G",
    description: "6 Núcleos, 12 Hilos, Gráficos Radeon Vega 7 Integrados",
    handle: "store",
    category: "Procesadores",
    thumbnail: "/images/banner-pc.png",
  },
  {
    id: "prod_rtx4060",
    title: "Tarjeta de Video NVIDIA GeForce RTX 4060",
    description: "8GB GDDR6, Ray Tracing, DLSS 3, Ensamble Gamer",
    handle: "store",
    category: "Tarjetas de Video",
    thumbnail: "/images/banner-pc.png",
  },
  {
    id: "prod_ram",
    title: "Memoria RAM Kingston Fury Beast 16GB DDR4 / DDR5",
    description: "Alta frecuencia para gaming y productividad técnica",
    handle: "store",
    category: "Memorias & SSD",
    thumbnail: "/images/banner-upgrade.png",
  },
  {
    id: "prod_ssd",
    title: "Disco Sólido Kingston NV2 NVMe PCIe 4.0 M.2",
    description: "Almacenamiento ultra rápido de 1TB y 2TB",
    handle: "store",
    category: "Memorias & SSD",
    thumbnail: "/images/banner-upgrade.png",
  },
  {
    id: "prod_perifericos",
    title: "Periféricos & Pantallas Gamer",
    description: "Teclados mecánicos, mouse ópticos y monitores FHD / QHD",
    handle: "store",
    category: "Periféricos",
    thumbnail: "/images/banner-perifericos.png",
  },
]

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cerrar lista al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Búsqueda instantánea en vivo
  useEffect(() => {
    const clean = query.trim().toLowerCase()

    if (!clean) {
      setResults([])
      setIsOpen(false)
      return
    }

    const matches = CATALOG.filter((item) => {
      const fullText = `${item.title} ${item.description} ${item.category}`.toLowerCase()

      if (fullText.includes(clean)) return true

      // Tolerancia a typos (Fuzzy logic)
      if ((clean.includes("lenov") || clean.includes("lenvo")) && fullText.includes("lenovo")) return true
      if ((clean.includes("and") || clean.includes("amf")) && fullText.includes("amd")) return true
      if ((clean.includes("tarejta") || clean.includes("tarjet") || clean.includes("tarj")) && fullText.includes("tarjeta")) return true
      if ((clean.includes("procesador") || clean.includes("proce") || clean.includes("prcesador")) && fullText.includes("procesador")) return true
      if ((clean.includes("memori") || clean.includes("menoria") || clean.includes("ram")) && fullText.includes("ram")) return true
      if ((clean.includes("disko") || clean.includes("solido") || clean.includes("disco")) && fullText.includes("ssd")) return true
      if ((clean.includes("latop") || clean.includes("laptp") || clean.includes("portatil")) && fullText.includes("laptop")) return true

      return false
    })

    setResults(matches.slice(0, 5)) // Solo 5 sugerencias clave para no saturar
    setIsOpen(true)
  }, [query])

  // Manejador del Enter / Envío del formulario
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setIsOpen(false)
    // Redirige al catálogo general filtrando por el término ingresado
    router.push(`/store?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-4">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Buscar procesadores, laptops, RTX, RAM... (Presiona Enter)"
          className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-transparent focus:border-[#E31837] rounded-full outline-hidden transition-all text-neutral-800 placeholder:text-neutral-400 focus:shadow-xs"
        />

        {/* Ícono Lupa (funciona también como botón de envío) */}
        <button
          type="submit"
          className="absolute left-3 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          aria-label="Buscar"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Botón limpiar input */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </form>

      {/* Menú flotante de vista previa rápida (máx 5) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in duration-150">
          {results.length > 0 ? (
            <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              {results.map((item) => (
                <LocalizedClientLink
                  key={item.id}
                  href={item.handle === "store" ? "/store" : `/products/${item.handle}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 bg-neutral-100 rounded-md flex items-center justify-center text-[10px] text-neutral-500 shrink-0 font-bold border border-neutral-200">
                    PC
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-neutral-800 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 line-clamp-1">
                      {item.description}
                    </span>
                  </div>

                  <span className="text-neutral-400 text-xs font-bold shrink-0">→</span>
                </LocalizedClientLink>
              ))}

              <LocalizedClientLink
                href={`/store?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block p-2.5 text-center text-[11px] font-bold text-[#E31837] bg-red-50/60 hover:bg-red-50 transition-colors"
              >
                Ver todos los resultados para "{query}" (o presiona Enter) →
              </LocalizedClientLink>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-neutral-500">
              No hay coincidencias directas. Presiona <strong>Enter</strong> para buscar en toda la tienda.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
