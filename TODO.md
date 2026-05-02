# Vuelvoono — App de Lugares

Web app para anotar y calificar lugares visitados (restaurantes, bares, etc.) según cuatro categorías.

---

## Stack elegido

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** Next.js API Routes (same repo)
- **Base de datos:** PostgreSQL en Supabase (gratis, con auth integrado)
- **Auth:** Supabase Auth (magic link por email — solo tú puedes entrar)
- **Dev environment:** GitHub Codespaces (Node ya instalado, gratis 60h/mes)
- **Deploy:** Vercel (gratis, HTTPS automático, preview en cada push)

---

## Costo total: $0/mes

| Servicio | Plan gratuito incluye | ¿Te alcanza? |
|---|---|---|
| **GitHub** | Repos privados ilimitados, 60h/mes Codespaces | Sí |
| **Vercel** | Proyectos ilimitados, 100GB bandwidth/mes, preview deploys | Sí |
| **Supabase** | 500MB base de datos, 50.000 usuarios auth | Sí |

**No necesitas tarjeta de crédito para ninguno.**

---

## Flujo de trabajo

```
Codespace (browser) → push a GitHub → Vercel despliega en ~30s → URL live
```

---

## Fase 1 — Setup inicial

- [x] Crear repositorio privado en GitHub (`psorianom/vuelvoono`)
- [ ] Abrir Codespace: github.com/psorianom/vuelvoono → Code → Codespaces → New codespace
- [ ] Dentro del Codespace, crear el proyecto Next.js:
  ```bash
  npx create-next-app@latest app --typescript --tailwind --app --no-git
  ```
- [ ] Crear cuenta en [supabase.com](https://supabase.com) y crear un nuevo proyecto llamado `vuelvoono`
- [ ] Anotar las variables: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Dentro del Codespace, instalar cliente de Supabase:
  ```bash
  cd app && npm install @supabase/supabase-js @supabase/ssr
  ```
- [ ] Crear `app/.env.local` con las variables de Supabase
- [ ] Confirmar que `.env.local` está en `.gitignore`
- [ ] Conectar repo a [vercel.com](https://vercel.com) → Add New Project → importar `vuelvoono`
- [ ] Agregar las variables de entorno en Vercel (mismas del `.env.local`)

---

## Fase 2 — Base de datos

- [ ] Abrir el SQL Editor en Supabase y crear la tabla `lugares`:

```sql
create table lugares (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nombre text not null,
  ubicacion text not null,
  recepcion integer not null check (recepcion between 1 and 10),
  atencion integer not null check (atencion between 1 and 10),
  lugar integer not null check (lugar between 1 and 10),
  producto integer not null check (producto between 1 and 10),
  notas text
);
```

- [ ] Activar Row Level Security (RLS) en la tabla `lugares`
- [ ] Crear política RLS:

```sql
create policy "Solo usuario autenticado"
on lugares for all to authenticated
using (true) with check (true);
```

---

## Fase 3 — Autenticación

- [ ] En Supabase → Authentication → Providers: habilitar "Email" con magic link
- [ ] Crear `app/lib/supabase/client.ts` — cliente para el browser
- [ ] Crear `app/lib/supabase/server.ts` — cliente para server components
- [ ] Crear `app/middleware.ts` — redirige a `/login` si no hay sesión
- [ ] Crear página `/login` con input de email + botón "Enviar link"
- [ ] Crear ruta `/auth/callback` para que Supabase complete el login
- [ ] Push → verificar en Vercel que el login funciona con magic link

---

## Fase 4 — Página principal (lista de lugares)

- [ ] Crear página `/` protegida por middleware
- [ ] Query a Supabase para traer todos los lugares ordenados por fecha desc
- [ ] Card por lugar mostrando: nombre, ubicación, 4 notas, promedio, fecha
- [ ] Grilla responsive de cards
- [ ] Botón "+" que lleva a `/nuevo`
- [ ] Botón de cerrar sesión
- [ ] Push → verificar preview en Vercel

---

## Fase 5 — Página de agregar lugar

- [ ] Crear página `/nuevo`
- [ ] Formulario con: nombre, ubicación, recepción (1–10), atención (1–10), lugar (1–10), producto (1–10), notas (opcional)
- [ ] Validación antes de enviar
- [ ] INSERT en Supabase via Server Action
- [ ] Redirigir a `/` al guardar
- [ ] Push → probar flujo completo en Vercel

---

## Fase 6 — Pulir la interfaz

- [ ] Paleta de colores y tipografía con Tailwind
- [ ] Responsive (mobile-first)
- [ ] Loading states mientras carga la BD
- [ ] Estado vacío ("Aún no has anotado ningún lugar")
- [ ] Visualización clara de las 4 notas (barras o números grandes)

---

## Fase 7 — Configurar dominio y seguridad final

- [ ] En Supabase → Authentication → URL Configuration:
  - Site URL: `https://vuelvoono.vercel.app`
  - Redirect URLs: `https://vuelvoono.vercel.app/auth/callback`
- [ ] Confirmar que RLS está activo
- [ ] Confirmar que middleware bloquea todas las rutas excepto `/login` y `/auth/callback`
- [ ] Confirmar que `.env.local` no está en el repo
- [ ] Probar desde el móvil

---

## Extras opcionales (para después)

- [ ] Editar un lugar ya guardado
- [ ] Eliminar un lugar
- [ ] Filtrar/ordenar por categoría o nota
- [ ] Exportar a CSV
- [ ] Foto del lugar (upload a Supabase Storage)
- [ ] Mapa con los lugares
