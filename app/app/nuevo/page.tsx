'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function RatingSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  const color =
    value >= 8
      ? 'text-emerald-600'
      : value >= 6
      ? 'text-amber-500'
      : value >= 4
      ? 'text-orange-500'
      : 'text-red-500'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-stone-700">{label}</label>
        <span className={`text-lg font-black ${color}`}>{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-stone-900"
      />
      <div className="flex justify-between text-xs text-stone-300">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  )
}

export default function NuevoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    recepcion: 7,
    atencion: 7,
    lugar: 7,
    producto: 7,
    notas: '',
  })

  function setRating(field: 'recepcion' | 'atencion' | 'lugar' | 'producto') {
    return (v: number) => setForm(f => ({ ...f, [field]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.ubicacion.trim()) {
      setError('El nombre y la ubicación son obligatorios.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.from('lugares').insert([{
      nombre: form.nombre.trim(),
      ubicacion: form.ubicacion.trim(),
      recepcion: form.recepcion,
      atencion: form.atencion,
      lugar: form.lugar,
      producto: form.producto,
      notas: form.notas.trim() || null,
    }])

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-stone-400 hover:text-stone-600 transition-colors text-sm">
          ← volver
        </Link>
        <h1 className="text-xl font-black text-stone-900">Agregar lugar</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
            <input
              type="text"
              placeholder="El Bulli"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Ubicación</label>
            <input
              type="text"
              placeholder="Barcelona, España"
              value={form.ubicacion}
              onChange={e => setForm(f => ({ ...f, ubicacion: e.target.value }))}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-5">
          <RatingSlider label="Recepción" value={form.recepcion} onChange={setRating('recepcion')} />
          <RatingSlider label="Atención / Servicio" value={form.atencion} onChange={setRating('atencion')} />
          <RatingSlider label="Lugar" value={form.lugar} onChange={setRating('lugar')} />
          <RatingSlider label="Producto" value={form.producto} onChange={setRating('producto')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Notas <span className="text-stone-300 font-normal">(opcional)</span>
          </label>
          <textarea
            placeholder="Algo que quieras recordar..."
            value={form.notas}
            onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
            rows={3}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-stone-900 text-white rounded-xl px-4 py-3 font-medium hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
