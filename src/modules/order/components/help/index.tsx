import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
const Help=()=> <div className="mt-6"><Heading className="text-base-semi">¿Necesitas ayuda?</Heading><div className="my-2 text-sm"><LocalizedClientLink href="/contact" className="text-[#E6003D] hover:underline">Contacta con SUPPCOM</LocalizedClientLink></div></div>
export default Help
