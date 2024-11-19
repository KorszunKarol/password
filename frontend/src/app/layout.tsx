import { Figtree } from 'next/font/google'
import "./globals.css"

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} font-figtree`}>
        {children}
      </body>
    </html>
  )
}
