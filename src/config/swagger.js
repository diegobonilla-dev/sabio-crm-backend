//src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

// Opciones de configuración para swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de SaBio (CRM + Operaciones)',
      version: '1.0.0',
      description: 'Documentación oficial de la API para el proyecto SaBio, gestionando el CRM y las operaciones de agricultura regenerativa.',
    },
    
    // --- ¡BLOQUE ACTIVADO! ---
    // Esto define CÓMO se ve la seguridad. Le dice a Swagger:
    // "Vamos a usar un 'Bearer Token' (JWT)".
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    // --- ¡BLOQUE ACTIVADO! ---
    // Esto aplica esa seguridad a TODAS las rutas por defecto.
    // (Por eso en lead.routes.js añadimos 'security: []'
    // en los comentarios de Swagger, para que lo usen).
    security: [{
      bearerAuth: []
    }]
    
  },
  // La clave: ¿Dónde buscará Swagger los comentarios?
  // Le decimos que busque en TODOS los archivos .js dentro de la carpeta /routes
  apis: ['./src/routes/*.js'], 
};

export const swaggerSpecs = swaggerJSDoc(options);