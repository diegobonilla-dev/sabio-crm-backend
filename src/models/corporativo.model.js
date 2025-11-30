//src/models/corporativo.model.js
import { Schema, model } from 'mongoose';

const corporativoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  
  // --- La Relación M-N (Muchos-a-Muchos) ---
  // Guardamos un array de las fincas que este corporativo "supervisa".
  fincas_asociadas: [{
    type: Schema.Types.ObjectId,
    ref: 'Finca' 
  }]
}, {
  timestamps: true
});

const Corporativo = model('Corporativo', corporativoSchema);
export default Corporativo;