//src/utils/asyncHandler.js
/**
 * Envoltorio para controladores asíncronos que maneja
 * automáticamente los errores y los pasa a 'next()'.
 * Esto evita tener que escribir try...catch en cada controlador.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next); // Pasa cualquier error al manejador de errores global
};

export default asyncHandler;