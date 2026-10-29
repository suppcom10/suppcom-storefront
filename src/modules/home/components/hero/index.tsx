import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categories = [
  {
    name: "Laptops",
    badge: "Portátiles",
    color: "hover:border-[#E31837] hover:shadow-red-500/10 text-neutral-800 hover:text-[#E31837]",
    iconBg: "group-hover:bg-red-50 group-hover:text-[#E31837]",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "PC Armadas",
    badge: "Custom Gamer",
    color: "hover:border-amber-500 hover:shadow-amber-500/10 text-neutral-800 hover:text-amber-600",
    iconBg: "group-hover:bg-amber-50 group-hover:text-amber-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm4 4h6m-6 4h6m-6 4h2" />
      </svg>
    ),
  },
  {
    name: "Procesadores",
    badge: "AMD & Intel",
    color: "hover:border-blue-500 hover:shadow-blue-500/10 text-neutral-800 hover:text-blue-600",
    iconBg: "group-hover:bg-blue-50 group-hover:text-blue-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z" />
      </svg>
    ),
  },
  {
    name: "Placas Madre",
    badge: "Motherboards",
    color: "hover:border-emerald-500 hover:shadow-emerald-500/10 text-neutral-800 hover:text-emerald-600",
    iconBg: "group-hover:bg-emerald-50 group-hover:text-emerald-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 3h2m-2 3h2m-2 3h2m4-6h2m-2 3h2" />
      </svg>
    ),
  },
  {
    name: "Tarjetas Video",
    badge: "NVIDIA / Radeon",
    color: "hover:border-violet-500 hover:shadow-violet-500/10 text-neutral-800 hover:text-violet-600",
    iconBg: "group-hover:bg-violet-50 group-hover:text-violet-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 8h16M4 16h16M7 12h2m4 0h2" />
      </svg>
    ),
  },
  {
    name: "Memorias RAM",
    badge: "DDR4 / DDR5",
    color: "hover:border-cyan-500 hover:shadow-cyan-500/10 text-neutral-800 hover:text-cyan-600",
    iconBg: "group-hover:bg-cyan-50 group-hover:text-cyan-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16v12H4V6zm3 4v4m3-4v4m3-4v4m3-4v4" />
      </svg>
    ),
  },
  {
    name: "Discos SSD",
    badge: "NVMe M.2",
    color: "hover:border-fuchsia-500 hover:shadow-fuchsia-500/10 text-neutral-800 hover:text-fuchsia-600",
    iconBg: "group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 12h14M5 16h14" />
      </svg>
    ),
  },
  {
    name: "Periféricos",
    badge: "Setup & Audio",
    color: "hover:border-orange-500 hover:shadow-orange-500/10 text-neutral-800 hover:text-orange-600",
    iconBg: "group-hover:bg-orange-50 group-hover:text-orange-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4v16m-4-8h8" />
      </svg>
    ),
  },
]

export default function Hero() {
  return (
    <div className="relative w-full border-b border-neutral-100 bg-gradient-to-b from-neutral-50/60 to-white pt-8 pb-8">
      <div className="content-container flex flex-col items-center text-center max-w-3xl mx-auto px-4">
        
        {/* Badge superior compacto */}
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-50 border border-red-100 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E31837] animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider text-[#E31837] uppercase">
            Tienda Especializada de Cómputo
          </span>
        </div>

        {/* Titular proporcionado */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
          Laptops, Componentes y <span className="text-[#E31837]">PC de Alto Rendimiento</span>
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
          Hardware garantizado, ensamblaje a medida y repuestos originales. Asesoría técnica directa para gaming, trabajo pesado y oficina.
        </p>

        {/* Botones de acción */}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E31837] hover:bg-[#c9122e] text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all text-xs"
          >
            Ver Catálogo de Productos →
          </LocalizedClientLink>

          <a
            href="https://wa.me/519XXXXXXXX?text=Hola%20SuppCom,%20deseo%20cotizar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-semibold rounded-lg transition-all text-xs"
          >
            Cotizar por WhatsApp
          </a>
        </div>

        {/* Sellos de confianza */}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-6 text-[11px] text-neutral-500 font-medium pt-4 border-t border-neutral-200/60 w-full max-w-lg">
          <span className="flex items-center gap-1.5"><strong className="text-emerald-500">✓</strong> Garantía y Soporte Local</span>
          <span className="flex items-center gap-1.5"><strong className="text-blue-500">✓</strong> Boleta y Factura</span>
          <span className="flex items-center gap-1.5"><strong className="text-amber-500">✓</strong> Envíos a Nivel Nacional</span>
        </div>
      </div>

      {/* Grid de Categorías Interactivas */}
      <div className="content-container mt-8 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#E31837] rounded-full" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Explora por Categoría
            </h2>
          </div>
          <LocalizedClientLink 
            href="/store" 
            className="text-xs font-bold text-[#E31837] hover:text-[#c9122e] hover:translate-x-0.5 transition-all inline-flex items-center gap-1"
          >
            Ver todo el stock <span>→</span>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <LocalizedClientLink
              key={cat.name}
              href="/store"
              className={`group relative flex flex-col items-center text-center p-3 rounded-xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden ${cat.color}`}
            >
              {/* Contenedor del ícono con animación */}
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-600 group-hover:scale-110 transition-all duration-200 mb-2 ${cat.iconBg}`}>
                {cat.icon}
              </div>

              {/* Título de la categoría */}
              <span className="text-xs font-bold transition-colors leading-tight">
                {cat.name}
              </span>

              {/* Subtítulo / Badge */}
              <span className="text-[10px] text-neutral-400 group-hover:text-neutral-600 transition-colors mt-0.5">
                {cat.badge}
              </span>

              {/* Barra inferior reactiva al hover */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-transparent group-hover:bg-current transition-colors duration-200" />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}
