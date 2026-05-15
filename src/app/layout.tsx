import type { Metadata } from 'next'
import { Playfair_Display, Crimson_Pro, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
})

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mount Airy Walkbook — A Walking Guide to Main Street',
  description: 'A curated walking guide to downtown Mount Airy, NC. Ten stops from Snappy Lunch to the Will Monday House. The Balladeer, Thirsty Souls, Floyd\'s, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${crimson.variable} ${ibmMono.variable}`}>
        {children}
      </body>
    </html>
  )
}