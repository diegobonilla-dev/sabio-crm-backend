// src/models/passwordReset.model.js
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const passwordResetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index: MongoDB borrará automáticamente documentos expirados
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  used: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Hook para hashear el OTP antes de guardarlo
passwordResetSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar el OTP ingresado
passwordResetSchema.methods.compareOTP = async function (otpIngresado) {
  try {
    return await bcrypt.compare(otpIngresado, this.otp);
  } catch (error) {
    return false;
  }
};

// Método para verificar si está expirado
passwordResetSchema.methods.isExpired = function () {
  return Date.now() > this.expiresAt;
};

// Método para verificar si superó los intentos
passwordResetSchema.methods.hasExceededAttempts = function () {
  return this.attempts >= 3;
};

const PasswordReset = model('PasswordReset', passwordResetSchema);
export default PasswordReset;
