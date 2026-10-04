-- Seguimiento de cotizaciones: monto, notas, próximo seguimiento y canal.
-- Ejecutar una vez en Supabase → SQL Editor → New query → Run
-- (después de cotizaciones.sql).

alter table public.cotizaciones
  add column if not exists canal text not null default 'formulario'
    check (canal in ('formulario', 'whatsapp', 'telefono', 'correo', 'otro')),
  add column if not exists monto numeric(12, 2) check (monto >= 0),
  add column if not exists notas text check (char_length(notas) <= 2000),
  add column if not exists proximo_seguimiento date,
  add column if not exists actualizado_at timestamptz not null default now();

create index if not exists cotizaciones_seguimiento_idx
  on public.cotizaciones (estado, proximo_seguimiento);

-- La web pública solo crea cotizaciones del formulario, sin datos internos
-- (monto, notas, seguimiento): esos los llena solo el admin.
drop policy if exists "web crea cotizaciones" on public.cotizaciones;
create policy "web crea cotizaciones"
  on public.cotizaciones for insert
  to anon, authenticated
  with check (
    estado = 'nuevo'
    and canal = 'formulario'
    and monto is null
    and notas is null
    and proximo_seguimiento is null
  );

-- Marca la fecha de la última edición.
create or replace function public.cotizaciones_actualizado()
returns trigger language plpgsql as $$
begin
  new.actualizado_at = now();
  return new;
end;
$$;

drop trigger if exists cotizaciones_actualizado on public.cotizaciones;
create trigger cotizaciones_actualizado
  before update on public.cotizaciones
  for each row execute function public.cotizaciones_actualizado();
