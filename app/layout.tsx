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
      <body>
        <div className="bg-layer" />
        <div className="grid-bg" />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
