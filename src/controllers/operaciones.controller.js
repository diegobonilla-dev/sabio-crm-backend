//src/controllers/operaciones.controller.js
import Producto from '../models/producto.model.js';
import Aplicacion from '../models/aplicacion.model.js';
import Finca from '../models/finca.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name createProducto
 * @description Crea un nuevo producto en el catálogo.
 */
export const createProducto = asyncHandler(async (req, res) => {
  const { 
    nombre_producto, 
    marca, 
    tipo_producto, 
    composicion_n, 
    composicion_p, 
    composicion_k, 
    ingrediente_activo, 
    tiempo_carencia_dias 
  } = req.body;

  if (!nombre_producto || !tipo_producto) {
    res.status(400);
    throw new Error('Nombre y tipo de producto son obligatorios');
  }

  const newProducto = new Producto({
    nombre_producto,
    marca,
    tipo_producto,
    composicion_n,
    composicion_p,
    composicion_k,
    ingrediente_activo,
    tiempo_carencia_dias
  });

  const savedProducto = await newProducto.save();
  res.status(201).json({ message: 'Producto creado exitosamente', producto: savedProducto });
});

/**
 * @name createAplicacion
 * @description Registra una nueva aplicación de un producto en un lote.
 */
export const createAplicacion = asyncHandler(async (req, res) => {
  const { 
    productoId, 
    fincaId, 
    loteId, 
    cantidad_aplicada, 
    unidad_medida, 
    contexto_aplicacion,
    fecha_aplicacion,
    observaciones 
  } = req.body;

  if (!productoId || !fincaId || !loteId || !cantidad_aplicada || !unidad_medida || !contexto_aplicacion) {
    res.status(400);
    throw new Error('Faltan campos obligatorios');
  }

  const finca = await Finca.findById(fincaId);
  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  const zonaQueContieneElLote = finca.divisiones_primarias.find(z => z.divisiones_secundarias.id(loteId));
  if (!zonaQueContieneElLote) {
    res.status(404);
    throw new Error('Lote no encontrado en esta finca');
  }
  
  const producto = await Producto.findById(productoId);
  if (!producto) {
    res.status(404);
    throw new Error('Producto no encontrado en el catálogo');
  }

  const newAplicacion = new Aplicacion({
    producto: productoId,
    finca: fincaId,
    lote: loteId,
    registrada_por: req.user._id,
    fecha_aplicacion: fecha_aplicacion || new Date(),
    cantidad_aplicada,
    unidad_medida,
    contexto_aplicacion,
    observaciones
  });

  const savedAplicacion = await newAplicacion.save();
  res.status(201).json({ message: 'Aplicación registrada exitosamente', aplicacion: savedAplicacion });
});