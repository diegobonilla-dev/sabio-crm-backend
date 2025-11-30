import Producto from '../models/producto.model.js';
import Aplicacion from '../models/aplicacion.model.js';
import Finca from '../models/finca.model.js';

/**
 * @name createProducto
 * @description Crea un nuevo producto en el catálogo.
 */
export const createProducto = async (req, res) => {
  try {
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
      return res.status(400).json({ message: 'Nombre y tipo de producto son obligatorios' });
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

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * @name createAplicacion
 * @description Registra una nueva aplicación de un producto en un lote.
 */
export const createAplicacion = async (req, res) => {
  try {
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

    // 1. Validar datos
    if (!productoId || !fincaId || !loteId || !cantidad_aplicada || !unidad_medida || !contexto_aplicacion) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // 2. Verificar que la Finca exista
    const finca = await Finca.findById(fincaId);
    if (!finca) {
      return res.status(404).json({ message: 'Finca no encontrada' });
    }

    // 3. Verificar que el Lote exista DENTRO de esa finca
    const zonaQueContieneElLote = finca.zonas.find(z => z.lotes.id(loteId));
    if (!zonaQueContieneElLote) {
      return res.status(404).json({ message: 'Lote no encontrado en esta finca' });
    }
    
    // 4. Verificar que el Producto exista
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado en el catálogo' });
    }

    // 5. Crear la Aplicación
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

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};