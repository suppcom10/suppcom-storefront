import { Metadata } from "next"
import { Inter, Fredoka } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import "styles/globals.css"
import WhatsAppButton from "@modules/common/components/whatsapp-button"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "SuppCom | Hardware, Laptops y Ensamblaje de PC en Perú",
    template: "%s | SuppCom",
  },
  description:
    "Tienda especializada en tecnología y hardware: Laptops, componentes de PC, repuestos y ensamblaje a medida con garantía local.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es" data-mode="light" className={`${inter.variable} ${fredoka.variable}`}>
      <body className={`${inter.className} bg-white text-neutral-900 antialiased`}>
        <main className="relative">{props.children}</main>

        <main className="relative">{props.children}</main>
<WhatsAppButton />
      </body>
    </html>
  )
}
