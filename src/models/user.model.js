//src/models/user.model.js
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  
  // --- JERARQUÍA DE ROLES MEJORADA ---
  role: {
    type: String,
    enum: [
      // 1. Roles Internos de SaBio
      'sabio_admin',       // Ve todo
      'sabio_vendedor',    // Acceso al CRM (Leads)
      'sabio_tecnico',     // Acceso a Empresas/Fincas asignadas
      'sabio_laboratorio', // Acceso a módulos de muestras

      // 2. Roles de Clientes 
      'cliente_owner',     // El "Dueño" (ligado a una Empresa)
      'cliente_corporate'  // El "Corporativo" (ligado a un Corporativo)
    ],
    required: true
  },

  // --- REFERENCIAS INTELIGENTES ---
  // Usamos una función 'required' para que este campo solo sea
  // obligatorio si el rol es el correcto.

  // Si el rol es 'cliente_owner', ¿a qué 'Empresa' (dueño) pertenece?
  empresa: {
    type: Schema.Types.ObjectId,
    ref: 'Empresa',
    required: function() { return this.role === 'cliente_owner'; }
  },

  // Si el rol es 'cliente_corporate', ¿a qué 'Corporativo' (Starbucks) pertenece?
  corporativo: {
    type: Schema.Types.ObjectId,
    ref: 'Corporativo',
    required: function() { return this.role === 'cliente_corporate'; }
  },
  
  // (Opcional) Para 'sabio_tecnico', a qué fincas tiene acceso
  fincas_asignadas_tecnico: [{
    type: Schema.Types.ObjectId,
    ref: 'Finca'
  }],
  // --- DATOS PROFESIONALES (Para Técnicos) ---
  registro_profesional: { type: String, trim: true }, // Ej. Tarjeta Profesional
  firma_digital: { type: String } // URL de la imagen de la firma
}, {
  timestamps: true
});

// Hook de Mongoose para encriptar la contraseña ANTES de guardarla
userSchema.pre('save', async function (next) {
  // Si la contraseña no se ha modificado (ej. en un update de email), no la volvemos a encriptar
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generamos el "salt" (una cadena aleatoria para hacer el hash único)
    const salt = await bcrypt.genSalt(10);
    // Encriptamos la contraseña
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Añadimos un método "comparePassword" a nuestro modelo de usuario
userSchema.methods.comparePassword = async function (passwordIngresada) {
  try {
    // Compara la contraseña que nos da el usuario con la hasheada en la BD
    return await bcrypt.compare(passwordIngresada, this.password);
  } catch (error) {
    return false;
  }
};

// Sobreescribimos el método toJSON para limpiar la respuesta
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject(); // Convertimos el documento de Mongoose a un objeto plano

  // Eliminamos los campos que no queremos que viajen al frontend
  delete userObject.password;
  delete userObject.__v; 
  
  return userObject;
};

const User = model('User', userSchema);
export default User;