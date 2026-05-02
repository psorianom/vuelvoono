'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-black text-stone-900 mb-2">vuelvoono</h1>
        <p className="text-stone-400 text-sm mb-8">accede con tu cuenta de GitHub</p>
        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className="bg-stone-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-stone-700 transition-colors w-full"
        >
          Entrar con GitHub
        </button>
      </div>
    </div>
  )
}
