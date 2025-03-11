import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Master - Your To-Do List Solution",
  description: "Organize your tasks with our easy-to-use to-do list application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="min-vh-100">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'