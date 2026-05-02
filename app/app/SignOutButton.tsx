'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
    >
      Salir
    </button>
  )
}
