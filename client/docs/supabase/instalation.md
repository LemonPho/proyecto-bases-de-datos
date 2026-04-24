# Índice

- [Guía para clonar y configurar el proyecto React con Vite](#guía-para-clonar-y-configurar-el-proyecto-react-con-vite)
  - [Descripción general del sistema](#descripción-general-del-sistema)
  - [Requisitos previos](#requisitos-previos)
    - [Verificar si Node.js y npm están instalados](#verificar-si-nodejs-y-npm-están-instalados)
  - [Si no tienes Node.js o npm](#si-no-tienes-nodejs-o-npm)
  - [Entrar a la carpeta del frontend](#entrar-a-la-carpeta-del-frontend)
  - [Instalar dependencias](#instalar-dependencias)
  - [Levantar el proyecto en modo desarrollo](#levantar-el-proyecto-en-modo-desarrollo)
  - [Estructura básica esperada](#estructura-básica-esperada)
  - [Comandos útiles](#comandos-útiles)
    - [Instalar dependencias](#instalar-dependencias-1)
    - [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
    - [Generar build de producción](#generar-build-de-producción)
    - [Previsualizar build](#previsualizar-build)
  - [Posibles errores comunes](#posibles-errores-comunes)
    - [1. `npm: command not found`](#1-npm-command-not-found)
    - [2. `node: command not found`](#2-node-command-not-found)
    - [3. No existe `package.json`](#3-no-existe-packagejson)
    - [4. El puerto 5173 ya está en uso](#4-el-puerto-5173-ya-está-en-uso)
  - [Nota sobre Supabase](#nota-sobre-supabase)
  - [Resumen](#resumen)
- [Guía de Configuración: Supabase CLI y Base de Datos](#guía-de-configuración-supabase-cli-y-base-de-datos)
  - [1. Instalación de Supabase CLI](#1-instalación-de-supabase-cli)
  - [2. Iniciar Sesión (Login)](#2-iniciar-sesión-login)
  - [🔗 3. Inicializar y Vincular el Proyecto](#-3-inicializar-y-vincular-el-proyecto)
  - [4. Variables de Entorno (.env)](#4-variables-de-entorno-env)
  - [5. Manejo de Migraciones (Migrations)](#5-manejo-de-migraciones-migrations)
    - [Ver el estado actual](#ver-el-estado-actual)
    - [Bajar cambios (Pull)](#bajar-cambios-pull)
    - [Subir cambios (Push)](#subir-cambios-push)
    - [Crear una nueva migración](#crear-una-nueva-migración)
  - [Resumen de comandos (los más importantes)](#resumen-de-comandos-los-más-importantes)

---

# Guía para clonar y configurar el proyecto React con Vite

## Descripción general del sistema

Este repositorio contiene la base del **frontend** del proyecto, construida con **React** y **Vite**.

La idea general del sistema es la siguiente:

- **React** se usa para construir la interfaz visual de la aplicación.
- **Vite** se usa como herramienta de desarrollo para levantar el proyecto rápidamente, compilarlo y facilitar el trabajo local.
- El frontend está pensado para conectarse después con una base de datos **PostgreSQL** hospedada en **Supabase**.
- En esta etapa, lo importante es dejar funcionando correctamente la parte de **React en local**.
- La configuración específica de **Supabase** puede agregarse después por otra persona del equipo.

En otras palabras, por ahora este instructivo se enfoca en que cualquier integrante pueda:

- clonar el repositorio,
- instalar las dependencias necesarias,
- levantar el proyecto en su máquina,
- y confirmar que la parte de React funciona correctamente.

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js**
- **npm**

### Verificar si Node.js y npm están instalados

En la terminal, ejecuta:

```bash
node -v
npm -v
```

Si ambos comandos muestran una versión, ya tienes todo listo para trabajar con React y Vite.

---

## Si no tienes Node.js o npm

Normalmente **npm se instala junto con Node.js**, así que al instalar Node.js obtienes ambos.

Puedes descargar Node.js desde su sitio oficial:

- https://nodejs.org/

Después de instalarlo, vuelve a comprobar con:

```bash
node -v
npm -v
```

---

## Entrar a la carpeta del frontend

Si el proyecto está organizado con una carpeta `client`, entra a ella con:

```bash
cd client
```

Si ves un archivo llamado `package.json`, entonces estás en la carpeta correcta.

---

## Instalar dependencias

Una vez ubicado en la carpeta donde está `package.json`, ejecuta:

```bash
npm install
```

Este comando descarga e instala todas las dependencias del proyecto que fueron definidas previamente.

Por ejemplo, aquí se instalarán librerías como:

- React
- Vite
- y cualquier otra dependencia agregada al frontend

---

## Levantar el proyecto en modo desarrollo

Después de instalar las dependencias, ejecuta:

```bash
npm run dev
```

Si todo está bien, Vite mostrará en la terminal una dirección local similar a esta:

```text
http://localhost:5173
```

Abre esa dirección en tu navegador.

Si la aplicación carga correctamente, entonces el entorno del frontend ya está configurado.

---

## Estructura básica esperada

De manera general, la estructura mínima de un proyecto con React y Vite suele verse así:

```text
proyecto/
  client/
    src/
      App.jsx
      main.jsx
    package.json
    vite.config.js
```

Los archivos más importantes para esta parte del proyecto son:

- `package.json`: contiene dependencias y scripts.
- `vite.config.js`: configuración básica de Vite.
- `src/main.jsx`: punto de entrada de la aplicación.
- `src/App.jsx`: componente principal.

---

## Comandos útiles

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Generar build de producción

```bash
npm run build
```

### Previsualizar build

```bash
npm run preview
```

---

## Posibles errores comunes

### 1. `npm: command not found`

Significa que **npm no está instalado** o no está configurado en el PATH.

Solución: instalar Node.js correctamente.

### 2. `node: command not found`

Significa que **Node.js no está instalado**.

Solución: descargarlo e instalarlo desde el sitio oficial.

### 3. No existe `package.json`

Probablemente no estás en la carpeta correcta.

Solución: entra a la carpeta donde realmente está el frontend.

### 4. El puerto 5173 ya está en uso

Puede pasar si ya hay otra instancia de Vite corriendo.

Solución:

- cerrar el otro proceso, o
- levantar nuevamente y usar el puerto alternativo que Vite sugiera.

---

## Nota sobre Supabase

Este proyecto está pensado para conectarse posteriormente con **Supabase** y una base de datos **PostgreSQL**, pero esa parte no es necesaria para dejar funcionando la base del frontend.

Por lo tanto, en esta etapa:

- **sí es necesario** tener funcionando React con Vite,
- **no es necesario todavía** configurar Supabase para poder correr la interfaz base.

La integración con Supabase se puede agregar después, una vez que el equipo tenga lista esa parte.

---

## Resumen

Para comenzar a trabajar en este proyecto, el flujo básico es:

1. Instalar **Git**, **Node.js** y **npm**.
2. Clonar el repositorio.
3. Entrar a la carpeta del frontend.
4. Ejecutar `npm install`.
5. Ejecutar `npm run dev`.
6. Abrir la URL local que muestra Vite en el navegador.

Con eso ya deberías poder trabajar sobre la base del frontend del proyecto.

---
--- 

# Guía de Configuración: Supabase CLI y Base de Datos

En este proyecto estaremos utilizando **Supabase** como nuestro backend y base de datos (PostgreSQL). Para que todos podamos trabajar en la misma sintonía, mantener la base de datos sincronizada y no pisarnos los talones, usaremos la herramienta de consola (CLI) de Supabase.

Sigue estos pasos para configurar tu entorno local.

---

## 1. Instalación de Supabase CLI

Lo primero es instalar la herramienta de consola en tu computadora. Elige el comando según tu sistema operativo:

**Windows:**
```bash
# Si tienes Scoop instalado:
scoop bucket add supabase [https://github.com/supabase/scoop-bucket.git](https://github.com/supabase/scoop-bucket.git)
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
