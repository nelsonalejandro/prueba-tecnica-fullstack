# Prueba Técnica Fullstack - React + Node.js

Aplicación web para mostrar y gestionar un listado de artículos, con funcionalidades de búsqueda, filtrado, edición y exportación.

## ¿En qué consiste el proyecto?

- **Frontend:** React + TypeScript, Material-UI, React Query, virtualización de listas, edición inline, modo oscuro, exportación a CSV, pruebas unitarias y e2e.
- **Backend:** Node.js + TypeScript, API REST, lógica de negocio, desencriptación, validaciones, seguridad, pruebas unitarias.
- **Datos de prueba:** 10.000 artículos y tasas de cambio.

## 📁 Estructura del Proyecto

```
prueba-tecnica-fullstack/
├── frontend/          # Aplicación React
├── backend/           # API Node.js
├── shared/            # Tipos compartidos
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd prueba-tecnica-fullstack
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

## 🚀 Ejecución

### Backend
```bash
cd backend
npm run dev          # Desarrollo
npm run build        # Build para producción
npm start            # Ejecutar en producción
```

### Frontend
```bash
cd frontend
npm start           # Desarrollo
npm run build       # Build para producción
```

### Ejecutar ambos simultáneamente
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

## 🔧 Configuración de variables de entorno

### Backend (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=tu-clave-de-encriptacion
```

### Frontend (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

> Asegúrate de crear el archivo `.env` en cada carpeta y de reiniciar el servidor tras cualquier cambio.

## 📱 Uso de la Aplicación

1. Accede a [http://localhost:3000](http://localhost:3000)
2. Usa los filtros, búsqueda y ordenamiento en la tabla de artículos.
3. Edita nombre y monto haciendo clic en las celdas correspondientes.
4. Exporta los datos filtrados a CSV con el botón correspondiente.

## 🧪 Pruebas

### Backend
```bash
cd backend
npm test            # Ejecutar todas las pruebas
npm run test:watch  # Modo watch
```

### Frontend
```bash
cd frontend
npm test            # Ejecutar pruebas unitarias
npm run test:e2e    # Ejecutar pruebas e2e (si están configuradas)
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Commit y push de tus cambios
4. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de una prueba técnica. 