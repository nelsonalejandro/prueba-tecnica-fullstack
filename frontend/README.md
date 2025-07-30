# Frontend - Prueba Técnica Fullstack

Este proyecto es el frontend de la prueba técnica, desarrollado en React + TypeScript. Permite visualizar, filtrar, buscar, editar y exportar artículos de manera eficiente y responsiva.

## 🚀 Características principales
- Listado de artículos con virtualización (soporta grandes volúmenes de datos)
- Búsqueda y filtrado por país, nombre y estado
- Ordenamiento por fecha y monto
- Edición inline de nombre y monto
- Advertencias visuales para inconsistencias
- Modo oscuro y claro
- Exportación a CSV
- Pruebas unitarias y e2e

## 🛠️ Instalación y configuración

### Prerrequisitos
- Node.js v18 o superior
- npm o yarn

### Instalación

1. Ve a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

### Variables de entorno

Crea un archivo `.env` en la raíz de `frontend` con el siguiente contenido:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

Asegúrate de que la URL apunte al backend correcto. Reinicia el servidor tras cualquier cambio en este archivo.

## 🚀 Ejecución en local

Para iniciar el frontend en modo desarrollo:

```bash
npm start
# o
yarn start
```

Esto abrirá la aplicación en [http://localhost:3000](http://localhost:3000)

## 🧪 Pruebas

Para ejecutar las pruebas unitarias:

```bash
npm test
# o
yarn test
```

Si tienes pruebas e2e configuradas:

```bash
npm run test:e2e
# o
yarn test:e2e
```

## 📄 Notas
- Este frontend depende de que el backend esté corriendo y accesible en la URL configurada.
- Para más detalles sobre la arquitectura y el resto del proyecto, revisa el README principal en la raíz del repositorio.