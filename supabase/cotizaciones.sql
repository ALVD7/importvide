-- Tabla de cotizaciones del formulario https://importvide.com/cotizar
-- Ejecutar una vez en Supabase → SQL Editor → New query → Run.

create table if not exists public.cotizaciones (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  nombre           text not null check (char_length(nombre) between 2 and 120),
  empresa          text check (char_length(empresa) <= 160),
  producto         text not null check (char_length(producto) <= 80),
  cantidad         integer not null check (cantidad between 1 and 10000000),
  fecha_requerida  date,
  ciudad           text not null check (char_length(ciudad) <= 80),
  contacto         text not null check (char_length(contacto) <= 120),
  mensaje          text check (char_length(mensaje) <= 1000),
  origen           jsonb not null default '{}'::jsonb,
  pagina           text,
  estado           text not null default 'nuevo'
                   check (estado in ('nuevo', 'contactado', 'cotizado', 'ganado', 'perdido'))
);

create index if not exists cotizaciones_created_at_idx on public.cotizaciones (created_at desc);

alter table public.cotizaciones enable row level security;

-- La web (clave pública) solo puede CREAR cotizaciones nuevas: no puede leer,
-- editar ni borrar las de otros.
drop policy if exists "web crea cotizaciones" on public.cotizaciones;
create policy "web crea cotizaciones"
  on public.cotizaciones for insert
  to anon, authenticated
  with check (estado = 'nuevo');

-- Solo los usuarios con rol admin (tabla profiles) pueden verlas y gestionarlas.
drop policy if exists "admin gestiona cotizaciones" on public.cotizaciones;
create policy "admin gestiona cotizaciones"
  on public.cotizaciones for all
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
