//src/models/producto.model.js
import { Schema, model } from 'mongoose';

const productoSchema = new Schema({
  nombre_producto: { type: String, required: true, trim: true },
  marca: { type: String, trim: true },
  
  // Reemplaza 'productos_fumigacion' y 'productos_fertilizantes'
  tipo_producto: {
    type: String,
    enum: [
      'Fertilizante', 
      'Pesticida', 
      'Fungicida', 
      'Herbicida', 
      'Foliar',
      'Otro'
    ],
    required: true
  },
  
  // Campos de Fertilizante
  composicion_n: { type: Number }, // Nitrógeno
  composicion_p: { type: Number }, // Fósforo
  composicion_k: { type: Number }, // Potasio

  // Campos de Fumigación
  ingrediente_activo: { type: String, trim: true },
  tiempo_carencia_dias: { type: Number }, // Días de espera

  activo: { type: Boolean, default: true } // ¿Está este producto en uso?
}, { timestamps: true });

const Producto = model('Producto', productoSchema);
export default Producto;