import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const categories = [
  {
    name: "Laptops",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    badge: "Portátiles",
    color: "group-hover:border-red-500 group-hover:text-red-500",
  },
  {
    name: "PC Armadas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm4 4h6m-6 4h6m-6 4h2" />
      </svg>
    ),
    badge: "Gamer & Workstation",
    color: "group-hover:border-amber-500 group-hover:text-amber-500",
  },
  {
    name: "Procesadores",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z" />
      </svg>
    ),
    badge: "AMD & Intel",
    color: "group-hover:border-blue-500 group-hover:text-blue-500",
  },
  {
    name: "Placas Madre",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 3h2m-2 3h2m-2 3h2m4-6h2m-2 3h2" />
      </svg>
    ),
    badge: "Motherboards",
    color: "group-hover:border-emerald-500 group-hover:text-emerald-500",
  },
  {
    name: "Tarjetas de Video",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 8h16M4 16h16M7 12h2m4 0h2" />
      </svg>
    ),
    badge: "NVIDIA / Radeon",
    color: "group-hover:border-indigo-500 group-hover:text-indigo-500",
  },
  {
    name: "Memorias RAM",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16v12H4V6zm3 4v4m3-4v4m3-4v4m3-4v4" />
      </svg>
    ),
    badge: "DDR4 / DDR5",
    color: "group-hover:border-cyan-500 group-hover:text-cyan-500",
  },
  {
    name: "Discos SSD",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 12h14M5 16h14" />
      </svg>
    ),
    badge: "NVMe M.2",
    color: "group-hover:border-violet-500 group-hover:text-violet-500",
  },
  {
    name: "Periféricos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v16m-4-8h8" />
      </svg>
    ),
    badge: "Teclados, Mouse & Audio",
    color: "group-hover:border-orange-500 group-hover:text-orange-500",
  },
]

const Hero = () => {
  return (
    <div className="relative w-full border-b border-neutral-100 bg-gradient-to-b from-neutral-50/70 to-white pt-12 pb-14">
      <div className="content-container flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#E31837] animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest text-[#E31837] uppercase">
            Tienda Especializada de Cómputo
          </span>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
          Laptops, Componentes y <span className="text-[#E31837]">PC de Alto Rendimiento</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
          Encuentra hardware garantizado, ensamblaje a medida y repuestos originales. Asesoría técnica directa para gaming, trabajo pesado y oficina.
        </p>

        {/* Botones de acción */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E31837] hover:bg-[#c9122e] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
          >
            Ver Catálogo de Productos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </LocalizedClientLink>

          <a
            href="https://wa.me/519XXXXXXXX?text=Hola%20SuppCom,%20deseo%20cotizar%20una%20PC%20o%20componente"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-semibold rounded-lg transition-all text-sm shadow-sm"
          >
            Cotizar por WhatsApp
          </a>
        </div>

        {/* Badges de confianza */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl pt-5 border-t border-neutral-200/80 text-xs text-neutral-600 font-medium">
          <div className="flex items-center justify-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span> Garantía y Soporte Local
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-blue-600 font-bold">✓</span> Boleta y Factura Electrónica
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-600 font-bold">✓</span> Envíos a Lima y Provincias
          </div>
        </div>
      </div>

      {/* Grid de Categorías */}
      <div className="content-container mt-12 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Explora por Categoría
          </h2>
          <LocalizedClientLink href="/store" className="text-xs font-semibold text-[#E31837] hover:underline">
            Ver todo el stock →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <LocalizedClientLink
              key={cat.name}
              href="/store"
              className={`group flex flex-col items-center text-center p-3 rounded-xl bg-white border border-neutral-200/70 hover:shadow-md transition-all duration-150 ${cat.color}`}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 group-hover:scale-105 transition-transform mb-2">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-neutral-800 group-hover:text-inherit leading-tight">
                {cat.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                {cat.badge}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero
