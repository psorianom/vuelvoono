const REPO = 'psorianom/vuelvoono'
const FILE = 'db/lugares.json'
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`

export type Lugar = {
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

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

function encodeJson(obj: unknown): string {
  const json = JSON.stringify(obj, null, 2)
  const bytes = new TextEncoder().encode(json)
  return btoa(Array.from(bytes).map(b => String.fromCharCode(b)).join(''))
}

function decodeJson(b64: string): unknown {
  const binary = atob(b64.replace(/\s/g, ''))
  const bytes = new Uint8Array(binary.split('').map(c => c.charCodeAt(0)))
  return JSON.parse(new TextDecoder().decode(bytes))
}

async function readFile(token: string): Promise<{ lugares: Lugar[]; sha: string }> {
  const res = await fetch(API, { headers: headers(token) })
  if (res.status === 404) return { lugares: [], sha: '' }
  if (!res.ok) throw new Error(`Error ${res.status}: token inválido o sin permisos`)
  const data = await res.json()
  return { lugares: decodeJson(data.content) as Lugar[], sha: data.sha }
}

export async function getLugares(token: string): Promise<Lugar[]> {
  const { lugares } = await readFile(token)
  return lugares.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function addLugar(token: string, input: Omit<Lugar, 'id' | 'created_at'>): Promise<void> {
  const { lugares, sha } = await readFile(token)
  const nueva: Lugar = { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() }
  const body: Record<string, string> = {
    message: `add: ${nueva.nombre}`,
    content: encodeJson([...lugares, nueva]),
  }
  if (sha) body.sha = sha
  const res = await fetch(API, { method: 'PUT', headers: headers(token), body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`Error al guardar: ${res.status}`)
}
