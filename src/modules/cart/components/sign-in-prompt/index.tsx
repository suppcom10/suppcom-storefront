import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
const SignInPrompt=()=> <div className="bg-white flex items-center justify-between gap-4">
  <div><Heading level="h2" className="txt-xlarge">¿Ya tienes una cuenta?</Heading><Text className="txt-medium text-ui-fg-subtle mt-2">Ingresa para consultar tus pedidos.</Text></div>
  <LocalizedClientLink href="/account"><Button variant="secondary" className="h-10" data-testid="sign-in-button">Iniciar sesión</Button></LocalizedClientLink>
</div>
export default SignInPrompt
