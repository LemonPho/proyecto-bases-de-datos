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