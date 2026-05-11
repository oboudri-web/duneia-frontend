import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '../components/BottomNav'

export const metadata: Metadata = {
  title: 'DuneIA — Connecte ton Pronote, progresse vraiment',
  description: 'DuneIA analyse ton compte Pronote complet et génère un plan de révision au millimètre.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
      </head>
      <body style={{overflowX:'hidden', width:'100%', maxWidth:'100vw'}}>
        <div className="bg-layer" />
        <div className="grid-bg" />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
