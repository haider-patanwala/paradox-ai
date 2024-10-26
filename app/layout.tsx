import type { Metadata } from "next"
import { Inter, Noto_Sans, Open_Sans } from "next/font/google"
import "./globals.css"
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer"

const inter = Noto_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Paradox",
  description: "Built with love by Team Paradox ❤️"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-arcBackground text-white`}>
        <main className="flex flex-col items-center justify-start w-full min-h-screen">
          <div className="absolute aspect-square w-[80rem] bg-slate-600/20 blur-3xl rounded-full -z-50 -top-[30rem] animate-pulse  ease-in-out" />

          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
