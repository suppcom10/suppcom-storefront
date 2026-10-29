"use client"

import { useState, useEffect, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchResult = {
  id: string
  title: string
  handle: string
  thumbnail?: string
  description?: string
  price?: string
}

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cerrar resultados al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Búsqueda en Meilisearch con debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const host = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || "http://127.0.0.1:7700"
        const apiKey = process.env.NEXT_PUBLIC_MEILISEARCH_KEY || "SuppCom2026MasterKeyPeru"

        const res = await fetch(`${host}/indexes/products/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            q: query,
            limit: 6,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setResults(data.hits || [])
          setIsOpen(true)
        }
      } catch (err) {
        console.error("Error buscando en Meilisearch:", err)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-4">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Buscar procesadores, laptops, RTX, RAM..."
          className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-transparent focus:border-[#E31837] rounded-full outline-hidden transition-all text-neutral-800 placeholder:text-neutral-400 focus:shadow-xs"
        />

        {/* Ícono Lupa */}
        <span className="absolute left-3 text-neutral-400 pointer-events-none">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        {/* Indicador de carga o botón limpiar */}
        {loading ? (
          <span className="absolute right-3 w-3 h-3 border-2 border-neutral-300 border-t-[#E31837] rounded-full animate-spin" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Menú flotante de resultados en vivo */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in duration-150">
          {results.length > 0 ? (
            <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              {results.map((item) => (
                <LocalizedClientLink
                  key={item.id}
                  href={`/products/${item.handle}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-10 h-10 object-contain rounded-md bg-neutral-100 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center text-[10px] text-neutral-400 shrink-0 font-bold">
                      PC
                    </div>
                  )}

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-neutral-800 truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 line-clamp-1">
                      {item.description || "Ver detalles del producto"}
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
                Ver todos los resultados para "{query}"
              </LocalizedClientLink>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-neutral-500">
              No se encontraron coincidencias para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
