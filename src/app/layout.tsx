import { getBaseURL } from "@lib/util/env"
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

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es" data-mode="light" className={`${inter.variable} ${fredoka.variable}`}>
      <body className={`${inter.className} bg-white text-neutral-900 antialiased`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
