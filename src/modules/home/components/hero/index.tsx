import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "Laptops",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    badge: "Portátiles",
    color: "group-hover:border-red-500 group-hover:text-red-500",
  },
  {
    name: "PC Armadas",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm4 4h6m-6 4h6m-6 4h2" />
      </svg>
    ),
    badge: "Custom",
    color: "group-hover:border-amber-500 group-hover:text-amber-500",
  },
  {
    name: "Procesadores",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z" />
      </svg>
    ),
    badge: "CPU",
    color: "group-hover:border-blue-500 group-hover:text-blue-500",
  },
  {
    name: "Placas Madre",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 3h2m-2 3h2m-2 3h2m4-6h2m-2 3h2" />
      </svg>
    ),
    badge: "Motherboards",
    color: "group-hover:border-emerald-500 group-hover:text-emerald-500",
  },
  {
    name: "Tarjetas de Video",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 8h16M4 16h16M7 12h2m4 0h2" />
      </svg>
    ),
    badge: "GPU",
    color: "group-hover:border-indigo-500 group-hover:text-indigo-500",
  },
  {
    name: "Memorias RAM",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v16m-4-8h8" />
      </svg>
    ),
    badge: "Setup",
    color: "group-hover:border-orange-500 group-hover:text-orange-500",
  },
]

const Hero = () => {
  return (
    <div className="relative w-full border-b border-neutral-100 bg-gradient-to-b from-neutral-50/60 to-white pt-16 pb-12">
      {/* Encabezado Principal */}
      <div className="content-container flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E31837] animate-pulse" />
          <span className="text-[11px] font-bold tracking-widest text-[#E31837] uppercase">
            Hardware & Soluciones Informáticas
          </span>
        </div>

        {/* Logo tipográfico con Fredoka */}
        <h1 className="font-brand text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#E31837] select-none">
          SuppC<span className="text-[#F5B800]">o</span>m
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">
          Laptops, componentes y ensamblaje de alto rendimiento
        </p>

        <p className="mt-3 text-sm sm:text-base text-neutral-500 max-w-xl leading-relaxed">
          Especialistas en armado de PC, repuestos y venta de componentes con garantía y soporte técnico local.
        </p>

        {/* Botón de acción */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#E31837] hover:bg-[#c9122e] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
          >
            Explorar Catálogo Completo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </LocalizedClientLink>
        </div>

        {/* Sellos de confianza rápida */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-6 border-t border-neutral-200/70 text-xs text-neutral-600 font-medium">
          <div className="flex items-center justify-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span> Garantía Local
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-blue-500 font-bold">✓</span> Boleta y Factura Electrónica
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-500 font-bold">✓</span> Envíos a Lima y Provincias
          </div>
        </div>
      </div>

      {/* Barra de Categorías de Hardware */}
      <div className="content-container mt-14 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Categorías Destacadas
          </h2>
          <LocalizedClientLink href="/store" className="text-xs font-semibold text-[#E31837] hover:underline">
            Ver todo →
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <LocalizedClientLink
              key={cat.name}
              href="/store"
              className={`group flex flex-col items-center text-center p-3.5 rounded-xl bg-white border border-neutral-200/80 hover:shadow-md transition-all duration-150 ${cat.color}`}
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 group-hover:scale-105 transition-transform mb-2">
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
