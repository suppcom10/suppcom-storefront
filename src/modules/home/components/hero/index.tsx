import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="relative w-full border-b border-ui-border-base bg-gradient-to-b from-neutral-50 to-white py-20 md:py-28">
      <div className="content-container flex flex-col items-center text-center gap-6 max-w-3xl mx-auto px-4">
        <span className="text-xs font-bold tracking-widest text-[#E31837] uppercase bg-red-50 px-3 py-1 rounded-full border border-red-100">
          Tecnología y Cómputo Especializado
        </span>

        <Heading
          level="h1"
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight"
        >
          SuppCom
          <span className="block text-2xl sm:text-3xl font-semibold text-neutral-600 mt-2">
            Laptops, componentes y ensamblaje de alto rendimiento
          </span>
        </Heading>

        <p className="text-base sm:text-lg text-neutral-600 max-w-xl">
          Equipos nuevos con garantía local, asesoría técnica directa y envíos rápidos a todo Lima y provincias.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
          <LocalizedClientLink href="/store">
            <Button className="w-full sm:w-auto px-8 py-3 bg-[#E31837] hover:bg-[#c4132e] text-white font-semibold rounded-md shadow-md transition-all text-sm">
              Ver Catálogo Completo
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero
