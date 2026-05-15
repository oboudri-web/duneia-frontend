'use client'
import { useRouter } from 'next/navigation'

type DuneProps = {
  size?: number
  animate?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export default function Dune({ size = 60, animate = true, onClick, style }: DuneProps) {
  return (
    <>
      <img
        src="/dune-mascotte.png"
        alt="Dune"
        onClick={onClick}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          cursor: onClick ? 'pointer' : 'default',
          animation: animate ? 'bounce 2s infinite' : 'none',
          filter: 'drop-shadow(0 4px 12px rgba(124,92,252,0.5))',
          ...style
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}} />
    </>
  )
}
