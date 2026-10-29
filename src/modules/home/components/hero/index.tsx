// En src/modules/home/components/hero/index.tsx:
// Cambia la cabecera del Hero para compactar altura:

<div className="relative w-full border-b border-neutral-100 bg-gradient-to-b from-neutral-50/50 to-white pt-8 pb-8">
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

    <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
      Hardware garantizado, ensamblaje a medida y repuestos originales. Asesoría técnica directa para gaming, trabajo pesado y oficina.
    </p>

    {/* Botones */}
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

    {/* Badges de confianza reducidos */}
    <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-[11px] text-neutral-500 font-medium">
      <span className="flex items-center gap-1.5"><strong className="text-emerald-500">✓</strong> Garantía y Soporte Local</span>
      <span className="flex items-center gap-1.5"><strong className="text-blue-500">✓</strong> Boleta y Factura Electrónica</span>
      <span className="flex items-center gap-1.5"><strong className="text-amber-500">✓</strong> Envíos a Lima y Provincias</span>
    </div>
  </div>

  {/* Categorías reducidas en margen superior */}
  <div className="content-container mt-8 px-4">
    {/* ... resto del grid de categorías sin cambios ... */}
