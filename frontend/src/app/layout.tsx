import { Figtree } from 'next/font/google'
import "./globals.css"

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="min-h-screen bg-white">
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
