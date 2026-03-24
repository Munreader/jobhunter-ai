'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// 🦋 MÜN OS Plaza with Mobile Touch Controls
// Left joystick: Move | Right joystick: Camera
const Plaza = dynamic(
  () => import('@/components/mun-os/Plaza'),
  { ssr: false }
)

export default function PlazaPage() {
  const router = useRouter()
  return <Plaza onBack={() => router.push('/')} />
}
