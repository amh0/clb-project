<<<<<<< HEAD
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
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> beginning of project, get points on the DB and graphic
