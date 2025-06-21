# mini app

## Backend - API (Node.js y Express)

El backend del proyecto esta desarrollado con **Node.js**, **Express.js** y **Mongoose** para la conexión con MongoDB.

### Estructura de backend

```
/backend
│
├── /docs/api    # Documentación de la API
├── /models      # Esquemas de la base de datos
├── /controllers # Controladores de las rutas
├── /routes      # Direccionamiento de los endpoints
├── index.js     # Entry point del servidor
├── .env         # Variables de entorno
└── package.json # Configuración y dependencias del proyecto
```

### Instalación

1. **Clona el repositorio:**

```bash
git clone git@github.com:amh0/clb-project.git
cd clb-project/backend
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura las variables de entorno:**

Crea un archivo .env en la carpeta /backend con el siguiente contenido:

```ini
MONGODB_URL=<tu-uri-de-mongodb>
```

### Ejecución del Servidor

Para iniciar el servidor en modo desarrollo con nodemon:

```bash
npm start
```

El servidor se iniciará en: `http://localhost:8800`

### Pruebas de la API con Postman

1. Abre **Postman**.
2. Realiza peticiones a tus endpoints, por ejemplo:

   `http://localhost:8800/api/lines/near-point`

   `http://localhost:8800/api/lineas/all`

3. Asegúrate de que el backend esté ejecutándose (`npm start`) antes de probar.
4. Consulta la carpeta [`/backend/docs/api`](./docs/api) para obtener detalles sobre los endpoints, formato de solicitud y respuestas esperadas.
