# Guía de Configuración: Supabase CLI y Base de Datos

En este proyecto estaremos utilizando **Supabase** como nuestro backend y base de datos (PostgreSQL). Para que todos podamos trabajar en la misma sintonía, mantener la base de datos sincronizada y no pisarnos los talones, usaremos la herramienta de consola (CLI) de Supabase.

Sigue estos pasos para configurar tu entorno local.

---

## 1. Instalación de Supabase CLI

Lo primero es instalar la herramienta de consola en tu computadora. Elige el comando según tu sistema operativo:

**Windows:**
```bash
# Si tienes Scoop instalado:
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Linux (Arch / Ubuntu, etc.):**
```bash
# Usuarios de Arch (via AUR):
yay -S supabase
```

Para verificar que se instaló correctamente, ejecuta:
```bash
supabase -v
```

o bien, ejecuta
```bash
supabase --version
```

---

## 2. Iniciar Sesión (Login)

Necesitamos conectar tu terminal con tu cuenta de Supabase.

1. Abre tu terminal y ejecuta:
   ```bash
   supabase login
   ```
2. Te pedirá un **Access Token**.
3. Haz click en Enter en la terminal. Se abrirá una ventana en tu navegador.
4. Copia el token y pégalo en la terminal.
5. Presiona Enter.
6. Deberás de ver un mensaje como este:
```
Token cli_tu_usuario@tu_computadora created successfully.

You are now logged in. Happy coding!
```
---

## 🔗 3. Inicializar y Vincular el Proyecto

Ahora vamos a conectar el código de tu computadora con nuestro proyecto en la nube de Supabase.

1. Asegúrate de estar en la carpeta raíz de nuestro proyecto en tu terminal.
2. Inicializa la configuración local (solo la primera vez):
   ```bash
   supabase init
   ```
   *(Esto creará una carpeta `supabase/` en el proyecto. No borrar.)*

3. Vincula el proyecto local con el de la nube. Necesitarás el **Reference ID** del proyecto (búscalo en la URL del dashboard de Supabase: `https://supabase.com/dashboard/project/<ESTE-ES-EL-ID>`):
   ```bash
   supabase link --project-ref <TU-PROJECT-ID>
   ```

4. Para no tener que ingresar la contraseña cada vez que ejecutes un comando de supabase, guárdala en una variable de entorno:
   ```bash
   export SUPABASE_PASSWORD="<TU-PASSWORD>"
   ```
---

## 4. Variables de Entorno (.env)

Para que nuestra app de React/Vite pueda conectarse a Supabase, necesitamos definir nuestras claves.

1. En la raíz del proyecto, crea un archivo llamado `.env` (si no existe ya).
2. Agrega las siguientes variables con las credenciales del proyecto:

```env
VITE_SUPABASE_URL="https://<TU-PROJECT-ID>.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-anon-key-super-larga"
```

⚠️ **IMPORTANTE:** Nunca subas el archivo `.env` a GitHub. Asegúrate de que `.env` esté listado dentro de nuestro archivo `.gitignore`.

---

## 5. Manejo de Migraciones (Migrations)

Las migraciones son un "historial de cambios" de nuestra base de datos (tablas nuevas, columnas modificadas, etc.). Así evitamos hacer cambios manuales que rompan el código de los demás.

### Ver el estado actual
Para ver qué migraciones se han aplicado y cuáles faltan, usa:
```bash
supabase migration list
```

### Bajar cambios (Pull)
Si alguien más del equipo hizo cambios en la base de datos en la nube y necesitas tenerlos en tu compu:
```bash
supabase db pull
```

### Subir cambios (Push)
Si creaste una nueva tabla o modificaste algo en la base de datos *localmente* o mediante archivos de migración y quieres subirlo a la base de datos principal de tu cuenta:
```bash
supabase db push
```

### Crear una nueva migración
Si vas a escribir un cambio en la estructura (ej. crear una tabla de `usuarios`):
```bash
supabase migration new crear_tabla_usuarios
```
Esto creará un archivo `.sql` en `supabase/migrations/`. Ahí escribes tu código SQL y luego haces `supabase db push`.

---

## Resumen de comandos (los más importantes)

* `supabase login` -> Iniciar sesión.
* `supabase link --project-ref <id>` -> Conectar tu repo con el proyecto en la nube.
* `supabase migration list` -> Ver el estado de las migraciones.
* `supabase db push` -> Subir tus cambios de base de datos a la nube.
* `supabase db pull` -> Traer los cambios de la nube a tu local.
```