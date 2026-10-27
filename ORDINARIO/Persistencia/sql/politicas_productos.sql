-- Puedes volver a ejecutar este script para dejar listas las políticas CRUD.
-- Acceso anon abierto para la práctica; usa políticas por usuario en una app privada.
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica de productos" ON public.productos;
CREATE POLICY "Lectura publica de productos"
ON public.productos FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Insercion publica de productos" ON public.productos;
CREATE POLICY "Insercion publica de productos"
ON public.productos FOR INSERT TO anon
WITH CHECK (producto IS NOT NULL AND length(trim(producto)) > 0 AND precio >= 0);

DROP POLICY IF EXISTS "Actualizacion publica de productos" ON public.productos;
CREATE POLICY "Actualizacion publica de productos"
ON public.productos FOR UPDATE TO anon
USING (true)
WITH CHECK (producto IS NOT NULL AND length(trim(producto)) > 0 AND precio >= 0);

DROP POLICY IF EXISTS "Eliminacion publica de productos" ON public.productos;
CREATE POLICY "Eliminacion publica de productos"
ON public.productos FOR DELETE TO anon USING (true);
