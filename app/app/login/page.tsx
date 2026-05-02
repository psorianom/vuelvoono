'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-stone-900">vuelvoono</h1>
          <p className="text-stone-400 mt-1 text-sm">accede con tu email</p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
            <p className="text-emerald-700 font-medium">Revisa tu email</p>
            <p className="text-emerald-600 text-sm mt-1">
              Te enviamos un link de acceso a {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-stone-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar link de acceso'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
