# Backend de Gestión de Artículos

Este backend proporciona una API REST para la gestión, consulta y exportación de artículos, incluyendo funcionalidades de cifrado de datos, filtros avanzados, estadísticas y exportación a CSV. Está construido con Node.js, Express y TypeScript.

## ¿Qué hace este backend?

- Permite consultar, filtrar y paginar artículos.
- Permite obtener un artículo por su ID.
- Permite actualizar artículos.
- Proporciona estadísticas agregadas de los artículos.
- Permite exportar los artículos a formato CSV.
- Expone la documentación interactiva de la API mediante Swagger.

---

## Documentación de la API (Swagger)

La documentación completa y actualizada de todos los endpoints está disponible en:

**[GET /api/docs](GET /api/docs)**

Aquí podrás explorar y probar la API de manera interactiva usando Swagger UI.

También puedes encontrar la especificación OpenAPI en el archivo `swagger.yaml` en la raíz del proyecto.

---

## Endpoints principales

- `GET /api/articles` — Listado de artículos (con filtros y paginación)
- `GET /api/articles/{id}` — Obtener artículo por ID
- `PUT /api/articles/{id}` — Actualizar artículo por ID
- `GET /api/articles/stats/statistics` — Obtener estadísticas
- `GET /api/articles/export/csv` — Exportar artículos a CSV
- `GET /api/docs` — Documentación Swagger interactiva

---

## ¿Cómo levantar el backend en local?

### 1. Clona el repositorio y entra a la carpeta del backend

```bash
git clone https://github.com/nelsonalejandro/prueba-tecnica-fullstack.git
cd backend
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Modifica el `.env.example` y crea un archivo `.env` en la raíz del backend con el siguiente contenido (ajusta los valores según tus necesidades):

```
ENCRYPTION_KEY=Y4c~ue0'5Majd,?R?94q@ih
NODE_ENV=development
PORT=3001
```

### 4. Genera los datos de ejemplo (opcional, si necesitas regenerar los artículos)

```bash
node scripts/generate-data.js
```

### 5. Inicia el servidor

```bash
npm run dev
```
o
```bash
npx ts-node src/index.ts
```

---

## Recursos útiles

- **Health check:** [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Documentación Swagger:** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)