# Prueba Técnica Fullstack - React + Node.js

Aplicación web responsiva para mostrar un listado de artículos con funcionalidades de ordenamiento, búsqueda, filtrado y edición.

## 🚀 Características

### Frontend (React + TypeScript)
- ✅ Listado de artículos con virtualización (soporte 10.000 artículos)
- ✅ Ordenamiento por fecha y monto
- ✅ Búsqueda por país o nombre
- ✅ Filtrado por estado
- ✅ Edición inline de nombre y monto
- ✅ Advertencias visuales para inconsistencias
- ✅ Interfaz responsiva
- ✅ Modo oscuro/claro (bonus)

### Backend (Node.js + TypeScript)
- ✅ API REST para artículos procesados
- ✅ Desencriptación de nombres
- ✅ Lógica de negocio para estados
- ✅ Cálculo de montos en USD
- ✅ Validaciones de datos
- ✅ Seguridad implementada

### Pruebas
- ✅ Pruebas unitarias en backend
- ✅ Pruebas de integración en frontend
- ✅ Pruebas end-to-end (bonus)

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
npm start           # Ejecutar en producción
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

## 📊 Datos de Prueba

El proyecto incluye:
- `backend/data/articles.json` - 10.000 registros de artículos
- `backend/data/exchange-rates.json` - Tasas de cambio por país

## 🔧 Configuración

### Variables de Entorno

**Backend (.env)**
```env
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=tu-clave-de-encriptacion
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📱 Uso de la Aplicación

1. **Acceso**: Abrir http://localhost:3000
2. **Navegación**: 
   - Usar los controles de ordenamiento en los headers de columna
   - Utilizar la barra de búsqueda para filtrar por país o nombre
   - Seleccionar estados en el filtro de estado
   - Hacer clic en celdas para editar nombre y monto
3. **Exportación**: Usar el botón "Exportar CSV" para descargar datos filtrados

## 🏗️ Arquitectura

### Backend
- **Framework**: Express.js con TypeScript
- **Validación**: Joi
- **Encriptación**: crypto-js
- **Pruebas**: Jest

### Frontend
- **Framework**: React 18 con TypeScript
- **Estado**: React Query + Context API
- **UI**: Material-UI o Tailwind CSS
- **Virtualización**: react-window
- **Pruebas**: React Testing Library + Jest

## 🔒 Seguridad

- Nombres encriptados en el backend
- Validación de datos en ambos extremos
- Sanitización de inputs
- Headers de seguridad configurados

## 📈 Rendimiento

- Virtualización para listas grandes
- Lazy loading de componentes
- Optimización de re-renders
- Caching con React Query

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es parte de una prueba técnica. 