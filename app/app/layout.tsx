import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from './SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vuelvoono',
  description: 'Mis lugares',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="es">
      <body className={`${inter.className} bg-stone-50 min-h-screen`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
