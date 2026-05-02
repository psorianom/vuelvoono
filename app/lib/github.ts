const REPO = process.env.GITHUB_REPO!
const TOKEN = process.env.GITHUB_TOKEN!
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

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
}

async function readFile(): Promise<{ lugares: Lugar[]; sha: string }> {
  const res = await fetch(API, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = await res.json()
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return { lugares: JSON.parse(content), sha: data.sha }
}

export async function getLugares(): Promise<Lugar[]> {
  const { lugares } = await readFile()
  return lugares.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function addLugar(input: Omit<Lugar, 'id' | 'created_at'>): Promise<void> {
  const { lugares, sha } = await readFile()
  const nueva: Lugar = { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() }
  const content = Buffer.from(JSON.stringify([...lugares, nueva], null, 2)).toString('base64')
  const res = await fetch(API, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `add: ${nueva.nombre}`, content, sha }),
  })
  if (!res.ok) throw new Error(`GitHub write error: ${res.status}`)
}
