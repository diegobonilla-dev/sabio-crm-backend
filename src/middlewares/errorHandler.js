//src/middlewares/errorHandler.js
/**
 * Middleware de manejo de errores global.
 * Captura todos los errores pasados por next() y envía una
 * respuesta JSON estandarizada.
 */
const errorHandler = (err, req, res, next) => {
  // Si el error ya tiene un statusCode (ej. un 404), úsalo. Si no, es un 500.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // --- Errores Específicos de Mongoose ---

  // Error de ID no encontrado (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso no encontrado. El ID proporcionado no es válido.';
  }

  // Error de Duplicación (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Error de duplicación: El campo '${field}' con valor '${err.keyValue[field]}' ya existe.`;
  }

  // Error de Validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // --- Respuesta Final ---
  res.status(statusCode).json({
    message: message,
    // Muestra el stack (pila de errores) solo si estamos en modo desarrollo
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;