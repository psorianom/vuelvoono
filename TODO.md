# Vuelvoono — App de Lugares

Web app para anotar y calificar lugares visitados (restaurantes, bares, etc.) según cuatro categorías.

---

## Stack elegido

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend:** Next.js API Routes (same repo)
- **Base de datos:** PostgreSQL en Supabase (gratis, con auth integrado)
- **Auth:** Supabase Auth (magic link por email — solo tú puedes entrar)
- **Deploy:** Vercel (gratis, HTTPS automático)

---

## Costo total: $0/mes

Todo el stack tiene tier gratuito más que suficiente para uso personal:

| Servicio | Plan gratuito incluye | ¿Te alcanza? |
|---|---|---|
| **Vercel** | Proyectos ilimitados, 100GB bandwidth/mes | Sí, con creces |
| **Supabase** | 500MB base de datos, 50MB storage, 50.000 usuarios auth | Sí, con creces |
| **GitHub** | Repos privados ilimitados | Sí |

**No necesitas tarjeta de crédito para ninguno de los tres.**
Si algún día superaras los límites (muy poco probable con uso personal), Supabase avisa antes de cobrar y puedes pausar el proyecto.

---

## Fase 1 — Setup del proyecto

- [ ] Instalar Node.js (v20+) si no lo tienes
- [ ] Crear proyecto: `npx create-next-app@latest vuelvoono --typescript --tailwind --app`
- [ ] Entrar al directorio: `cd vuelvoono`
- [ ] Crear repositorio en GitHub y hacer el primer push
- [ ] Crear cuenta en [supabase.com](https://supabase.com) y crear un nuevo proyecto
- [ ] Anotar las variables: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Instalar cliente de Supabase: `npm install @supabase/supabase-js @supabase/ssr`
- [ ] Crear archivo `.env.local` con las variables de Supabase
- [ ] Agregar `.env.local` al `.gitignore`

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
- [ ] Crear política RLS que solo permite acceso a usuarios autenticados:

```sql
-- Solo el dueño autenticado puede ver y modificar
create policy "Solo usuario autenticado"
on lugares
for all
to authenticated
using (true)
with check (true);
```

---

## Fase 3 — Autenticación

- [ ] Configurar Supabase Auth: en el dashboard habilitar "Email (magic link)"
- [ ] Agregar tu email como único usuario permitido (o simplemente usarlo como login)
- [ ] Crear `lib/supabase/client.ts` — cliente para el browser
- [ ] Crear `lib/supabase/server.ts` — cliente para server components
- [ ] Crear `middleware.ts` en la raíz — redirige a login si no hay sesión activa
- [ ] Crear página `/login` con formulario de magic link (input de email + botón)
- [ ] Crear ruta `/auth/callback` para que Supabase complete el login
- [ ] Probar el flujo completo: pedir magic link → recibirlo → quedar logueado

---

## Fase 4 — Página principal (lista de lugares)

- [ ] Crear página `/` (app/page.tsx) protegida por middleware
- [ ] Hacer query a Supabase para traer todos los lugares ordenados por fecha
- [ ] Diseñar tarjeta (card) para cada lugar mostrando:
  - Nombre y ubicación
  - Las cuatro notas (recepcion, atencion, lugar, producto)
  - Promedio general calculado
  - Fecha de visita
- [ ] Mostrar las tarjetas en una grilla (grid)
- [ ] Agregar botón "+" o "Agregar lugar" que lleva a `/nuevo`
- [ ] Agregar botón de cerrar sesión

---

## Fase 5 — Página de agregar lugar

- [ ] Crear página `/nuevo` (app/nuevo/page.tsx)
- [ ] Crear formulario con los campos:
  - Nombre del lugar (text input)
  - Ubicación (text input)
  - Recepción (slider o input numérico 1–10)
  - Atención / Servicio (slider o input numérico 1–10)
  - Lugar (slider o input numérico 1–10)
  - Producto (slider o input numérico 1–10)
  - Notas adicionales (textarea, opcional)
- [ ] Validar que todos los campos requeridos estén completos antes de enviar
- [ ] Al guardar, hacer INSERT en Supabase via API Route o Server Action
- [ ] Redirigir a `/` después de guardar exitosamente
- [ ] Mostrar mensaje de error si algo falla

---

## Fase 6 — Pulir la interfaz

- [ ] Elegir paleta de colores y tipografía con Tailwind
- [ ] Hacer la app responsive (que se vea bien en móvil)
- [ ] Agregar estados de carga (loading spinners) mientras se consulta la BD
- [ ] Mostrar mensaje cuando no hay lugares todavía ("Aún no has anotado ningún lugar")
- [ ] Agregar visualización clara de las cuatro notas (ej: barras de color o números grandes)
- [ ] Considerar página de detalle `/lugar/[id]` para ver un lugar completo (opcional)

---

## Fase 7 — Deploy

- [ ] Crear cuenta en [vercel.com](https://vercel.com) y conectar el repo de GitHub
- [ ] Agregar las variables de entorno en Vercel (las mismas del `.env.local`)
- [ ] Agregar la URL de producción de Vercel en Supabase → Authentication → URL Configuration:
  - Site URL: `https://tu-app.vercel.app`
  - Redirect URLs: `https://tu-app.vercel.app/auth/callback`
- [ ] Hacer deploy y verificar que el login funciona en producción
- [ ] Verificar que los datos se guardan y muestran correctamente
- [ ] Probar desde el móvil

---

## Fase 8 — Seguridad final (checklist)

- [ ] Confirmar que RLS está activo en Supabase (nadie sin login puede ver tus datos)
- [ ] Confirmar que el middleware bloquea todas las rutas excepto `/login` y `/auth/callback`
- [ ] Confirmar que `.env.local` no está en el repo de GitHub
- [ ] Confirmar que Vercel sirve la app con HTTPS (automático)
- [ ] No compartir la URL con nadie o protegerla con una contraseña fuerte en el magic link
- [ ] Revisar que no hay datos sensibles en el código fuente público

---

## Extras opcionales (para después)

- [ ] Editar un lugar ya guardado
- [ ] Eliminar un lugar
- [ ] Filtrar/ordenar por categoría o nota
- [ ] Exportar a CSV
- [ ] Mapa con los lugares usando Google Maps o Mapbox
- [ ] Foto del lugar (upload a Supabase Storage)
