import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '../components/BottomNav'

export const metadata: Metadata = {
  title: 'DuneIA — Connecte ton Pronote, progresse vraiment',
  description: 'DuneIA analyse ton compte Pronote complet et génère un plan de révision au millimètre.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
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
