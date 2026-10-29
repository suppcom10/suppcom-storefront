import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function PromoBanners() {
  return (
    <div className="content-container my-10 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Banner 1: PC Custom */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-6 text-white flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-800 min-h-[220px]">
          <div className="z-10 max-w-[60%]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F5B800] bg-neutral-800/90 px-2.5 py-1 rounded-md">
              A Medida
            </span>
            <h3 className="text-xl font-bold mt-3 leading-tight group-hover:text-amber-400 transition-colors">
              Ensamblaje & <br />PC Custom Gamer
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Intel Core Ultra y AMD Ryzen con pruebas de estrés y garantía.
            </p>
          </div>

          <div className="mt-6 z-10">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#E31837] hover:bg-[#c9122e] px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Cotizar Setup →
            </LocalizedClientLink>
          </div>

          {/* Imagen PC Gamer */}
          <div className="absolute right-1 bottom-1 w-36 h-36 sm:w-40 sm:h-40 z-0 pointer-events-none group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/banner-pc.png"
              alt="PC Gamer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Banner 2: Laptops */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E31837] via-[#d6132f] to-[#990c20] p-6 text-white flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group min-h-[220px]">
          <div className="z-10 max-w-[60%]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-900 bg-white px-2.5 py-1 rounded-md">
              Portátiles
            </span>
            <h3 className="text-xl font-bold mt-3 leading-tight">
              Laptops Corporativas <br />y de Rendimiento
            </h3>
            <p className="text-xs text-red-100 mt-2 leading-relaxed">
              Equipos sellados, SSD NVMe ultrarrápido y listas para trabajar.
            </p>
          </div>

          <div className="mt-6 z-10">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-100 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Ver Modelos →
            </LocalizedClientLink>
          </div>

          {/* Imagen Laptop */}
          <div className="absolute right-1 bottom-1 w-36 h-36 sm:w-40 sm:h-40 z-0 pointer-events-none group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/banner-laptop.png"
              alt="Laptops"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Banner 3: Upgrades */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200/90 p-6 text-neutral-900 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group min-h-[220px]">
          <div className="z-10 max-w-[60%]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-700 bg-neutral-200 px-2.5 py-1 rounded-md">
              Potencia tu equipo
            </span>
            <h3 className="text-xl font-bold mt-3 leading-tight group-hover:text-[#E31837] transition-colors">
              Upgrade de Discos SSD <br />y Memorias RAM
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              DDR4, DDR5 y NVMe Gen4 para acelerar tu máquina al instante.
            </p>
          </div>

          <div className="mt-6 z-10">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Ver Componentes →
            </LocalizedClientLink>
          </div>

          {/* Imagen SSD & RAM */}
          <div className="absolute right-1 bottom-1 w-36 h-36 sm:w-40 sm:h-40 z-0 pointer-events-none group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/banner-upgrade.png"
              alt="Upgrade SSD y RAM"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
