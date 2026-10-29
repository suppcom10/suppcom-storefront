import { Metadata } from "next"
import { Inter, Fredoka } from "next/font/google"
import "styles/globals.css"

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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://suppcom.pe"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SuppCom | Hardware, Laptops y Ensamblaje de PC en Perú",
    template: "%s | SuppCom",
  },
  description:
    "Tienda especializada en tecnología y hardware: Laptops, componentes de PC, repuestos y ensamblaje a medida con garantía local.",
  icons: {
  icon: "/icon.svg",
  shortcut: "/icon.svg",
  apple: "/icon.svg",
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
