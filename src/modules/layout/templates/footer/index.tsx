import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50/70 w-full mt-20">
      <div className="content-container flex flex-col w-full max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200">
          {/* Columna 1: Marca y Propuesta */}
          <div className="flex flex-col gap-y-3 md:col-span-1">
            <LocalizedClientLink href="/" className="inline-block">
              <img src="/logo.png" alt="SuppCom" className="h-8 w-auto object-contain" />
            </LocalizedClientLink>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Especialistas en componentes de cómputo, laptops, periféricos y ensamblaje personalizado de PC. Garantía local y soporte técnico directo.
            </p>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div className="flex flex-col gap-y-2 text-xs">
            <span className="font-bold text-neutral-900 uppercase tracking-wider mb-1">
              Catálogo
            </span>
            <LocalizedClientLink href="/store" className="text-neutral-600 hover:text-[#E31837] transition-colors">
              Todos los Productos
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className="text-neutral-600 hover:text-[#E31837] transition-colors">
              Laptops
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className="text-neutral-600 hover:text-[#E31837] transition-colors">
              Componentes de PC
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className="text-neutral-600 hover:text-[#E31837] transition-colors">
              Discos SSD & Memorias RAM
            </LocalizedClientLink>
          </div>

          {/* Columna 3: Información y Confianza */}
          <div className="flex flex-col gap-y-2 text-xs">
            <span className="font-bold text-neutral-900 uppercase tracking-wider mb-1">
              Atención y Garantía
            </span>
            <span className="text-neutral-600">📍 Cercado de Lima, Perú</span>
            <span className="text-neutral-600">🧾 Boletas y Facturas Electrónicas</span>
            <span className="text-neutral-600">🚚 Envíos a Lima y Provincias</span>
            <span className="text-neutral-600">🛡️ Garantía técnica oficial</span>
          </div>

          {/* Columna 4: Canal de Contacto */}
          <div className="flex flex-col gap-y-3 text-xs">
            <span className="font-bold text-neutral-900 uppercase tracking-wider">
              Ventas y Cotizaciones
            </span>
            <p className="text-neutral-500">
              ¿Dudas sobre compatibilidad o stock? Escríbenos directamente:
            </p>
            <a
              href="https://wa.me/519XXXXXXXX?text=Hola%20SuppCom,%20deseo%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-md transition-colors w-fit shadow-sm"
            >
              <span>Chatear por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Parte Inferior */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-neutral-500">
          <Text className="text-[11px]">
            © {new Date().getFullYear()} SuppCom. Todos los derechos reservados.
          </Text>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Hardware & High Performance Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
