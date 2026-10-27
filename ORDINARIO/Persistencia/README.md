# Persistencia — React Native + Supabase

Aplicación de práctica en JavaScript con Expo. El menú contiene componentes separados para CREATE, READ, UPDATE y DELETE.

## Configurar Supabase

En el SQL Editor de Supabase, ejecuta otra vez `sql/politicas_productos.sql` para habilitar lectura, inserción, actualización y eliminación para la clave pública. La tabla `public.productos` debe tener `id`, `producto`, `descripcion` y `precio`.

El archivo local `.env` debe contener el Project URL y la publishable key. Nunca uses una `service_role` ni secret key en la app.

## Ejecutar y usar

Desde esta carpeta ejecuta `npx expo start --tunnel` y escanea el QR con Expo Go. La app abre en **READ** y consulta los productos en una `FlatList`. Usa las pestañas **CREATE**, **UPDATE** y **DELETE** para insertar, editar o eliminar registros. El borrado pide confirmación antes de quitar el registro de Supabase.

Las políticas anon permiten que cualquier persona con la clave pública lea, inserte, edite y borre productos; están abiertas para esta práctica. Para datos privados o una app publicada, agrega autenticación y políticas por usuario.
