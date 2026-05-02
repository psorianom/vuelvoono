import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from './SignOutButton'

type Lugar = {
  id: string
  created_at: string
  nombre: string
  ubicacion: string
  recepcion: number
  atencion: number
  lugar: number
  producto: number
  notas: string | null
}

function scoreColor(v: number) {
  if (v >= 8) return 'bg-emerald-500'
  if (v >= 6) return 'bg-amber-400'
  if (v >= 4) return 'bg-orange-400'
  return 'bg-red-500'
}

function avgColor(v: number) {
  if (v >= 8) return 'text-emerald-600'
  if (v >= 6) return 'text-amber-500'
  if (v >= 4) return 'text-orange-500'
  return 'text-red-500'
}

function avg(l: Lugar) {
  return (l.recepcion + l.atencion + l.lugar + l.producto) / 4
}

function LugarCard({ lugar }: { lugar: Lugar }) {
  const average = avg(lugar)
  const date = new Date(lugar.created_at).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const categorias = [
    { label: 'Recepción', value: lugar.recepcion },
    { label: 'Atención', value: lugar.atencion },
    { label: 'Lugar', value: lugar.lugar },
    { label: 'Producto', value: lugar.producto },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-bold text-lg text-stone-900 leading-tight">{lugar.nombre}</h2>
          <p className="text-stone-400 text-sm mt-0.5">{lugar.ubicacion}</p>
        </div>
        <div className="text-right shrink-0">
          <span className={`text-3xl font-black ${avgColor(average)}`}>
            {average.toFixed(1)}
          </span>
          <p className="text-xs text-stone-300">/10</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {categorias.map(c => (
          <div key={c.label} className="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2">
            <span className="text-xs text-stone-500">{c.label}</span>
            <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${scoreColor(c.value)}`}>
              {c.value}
            </span>
          </div>
        ))}
      </div>

      {lugar.notas && (
        <p className="text-sm text-stone-400 italic border-t border-stone-50 pt-3">
          &ldquo;{lugar.notas}&rdquo;
        </p>
      )}

      <p className="text-xs text-stone-300 text-right">{date}</p>
    </div>
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: lugares } = await supabase
    .from('lugares')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-stone-900">vuelvoono</h1>
          <p className="text-sm text-stone-400">mis lugares</p>
        </div>
        <div className="flex items-center gap-3">
          <SignOutButton />
          <Link
            href="/nuevo"
            className="bg-stone-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-stone-700 transition-colors"
          >
            +
          </Link>
        </div>
      </div>

      {!lugares || lugares.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-lg">Todavía no has anotado ningún lugar.</p>
          <Link
            href="/nuevo"
            className="mt-4 inline-block bg-stone-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Agrega el primero
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lugares.map(lugar => (
            <LugarCard key={lugar.id} lugar={lugar} />
          ))}
        </div>
      )}
    </div>
  )
}
