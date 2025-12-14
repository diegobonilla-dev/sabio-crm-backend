// src/controllers/passwordReset.controller.js
import User from '../models/user.model.js';
import PasswordReset from '../models/passwordReset.model.js';
import { sendEmail, generateOTP } from '../utils/emailService.js';
import { resetPasswordEmailTemplate } from '../templates/resetPasswordEmail.js';
import asyncHandler from '../utils/asyncHandler.js';

// Constantes de configuración
const OTP_EXPIRATION_MINUTES = 5;
const MAX_REQUESTS_PER_HOUR = 3;
const MAX_ATTEMPTS = 3;

/**
 * POST /api/v1/auth/forgot-password
 * Envía un código OTP al email del usuario
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validar que el email existe
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'El email es obligatorio'
    });
  }

  // Buscar el usuario
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Por seguridad, no revelamos si el usuario existe
    return res.status(200).json({
      success: true,
      message: 'Si el correo existe en nuestro sistema, recibirás un código de verificación.'
    });
  }

  // Rate limiting: verificar cuántos códigos se han enviado en la última hora
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentRequests = await PasswordReset.countDocuments({
    email: email.toLowerCase(),
    createdAt: { $gte: oneHourAgo }
  });

  if (recentRequests >= MAX_REQUESTS_PER_HOUR) {
    return res.status(429).json({
      success: false,
      message: 'Has alcanzado el límite de solicitudes. Por favor, intenta más tarde.'
    });
  }

  // Generar OTP
  const otp = generateOTP();

  // Calcular fecha de expiración
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  // Guardar en la base de datos (el OTP se hasheará automáticamente por el pre-save hook)
  await PasswordReset.create({
    user: user._id,
    email: email.toLowerCase(),
    otp,
    expiresAt,
    ipAddress: req.ip || req.connection.remoteAddress
  });

  // Preparar y enviar el email
  const emailHtml = resetPasswordEmailTemplate({
    userName: user.name,
    otp,
    expirationMinutes: OTP_EXPIRATION_MINUTES
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Código de recuperación de contraseña - SaBio',
      html: emailHtml
    });

    res.status(200).json({
      success: true,
      message: 'Código de verificación enviado a tu correo electrónico.',
      expiresIn: OTP_EXPIRATION_MINUTES * 60 // Segundos para el timer del frontend
    });
  } catch (error) {
    // Si falla el envío del email, eliminamos el registro
    await PasswordReset.deleteOne({ user: user._id, otp });

    console.error('Error enviando email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar el correo. Por favor, intenta más tarde.'
    });
  }
});

/**
 * POST /api/v1/auth/verify-otp
 * Verifica el código OTP ingresado por el usuario
 */
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validar campos
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email y código OTP son obligatorios'
    });
  }

  // Validar formato del OTP (6 dígitos)
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: 'El código debe tener 6 dígitos'
    });
  }

  // Buscar el código más reciente para este email que:
  // - No haya sido usado
  // - No esté expirado
  // - No haya superado los intentos
  const resetRequest = await PasswordReset.findOne({
    email: email.toLowerCase(),
    used: false,
    attempts: { $lt: MAX_ATTEMPTS }, // Menos de 3 intentos
    expiresAt: { $gt: new Date() }    // No expirado
  }).sort({ createdAt: -1 });

  if (!resetRequest) {
    return res.status(404).json({
      success: false,
      message: 'No se encontró una solicitud de recuperación válida. Por favor, solicita un nuevo código.'
    });
  }

  // Verificar si está expirado (doble check por seguridad)
  if (resetRequest.isExpired()) {
    return res.status(400).json({
      success: false,
      message: 'El código ha expirado. Por favor, solicita uno nuevo.',
      expired: true
    });
  }

  // Verificar si superó los intentos (doble check por seguridad)
  if (resetRequest.hasExceededAttempts()) {
    return res.status(400).json({
      success: false,
      message: 'Has superado el número máximo de intentos. Por favor, solicita un nuevo código.',
      maxAttemptsReached: true
    });
  }

  // Comparar el OTP
  const isValid = await resetRequest.compareOTP(otp);

  if (!isValid) {
    // Incrementar intentos
    resetRequest.attempts += 1;
    await resetRequest.save();

    const attemptsLeft = MAX_ATTEMPTS - resetRequest.attempts;

    return res.status(400).json({
      success: false,
      message: `Código incorrecto. Te quedan ${attemptsLeft} ${attemptsLeft === 1 ? 'intento' : 'intentos'}.`,
      attemptsLeft
    });
  }

  // OTP válido: marcar como usado
  resetRequest.used = true;
  await resetRequest.save();

  // Generar un token temporal para el cambio de contraseña
  // (Este token solo es válido para cambiar la contraseña, no para autenticación completa)
  const resetToken = Buffer.from(
    JSON.stringify({
      userId: resetRequest.user,
      email: resetRequest.email,
      timestamp: Date.now()
    })
  ).toString('base64');

  res.status(200).json({
    success: true,
    message: 'Código verificado correctamente.',
    resetToken
  });
});

/**
 * POST /api/v1/auth/reset-password
 * Cambia la contraseña del usuario usando el resetToken
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Validar campos
  if (!resetToken || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token y nueva contraseña son obligatorios'
    });
  }

  // Validar longitud de la contraseña (consistente con tu sistema)
  if (newPassword.length < 6 || newPassword.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener entre 6 y 50 caracteres'
    });
  }

  // Decodificar el token
  let tokenData;
  try {
    tokenData = JSON.parse(Buffer.from(resetToken, 'base64').toString('utf-8'));
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Token inválido'
    });
  }

  // Verificar que el token no tenga más de 10 minutos
  const tokenAge = Date.now() - tokenData.timestamp;
  const TEN_MINUTES = 10 * 60 * 1000;

  if (tokenAge > TEN_MINUTES) {
    return res.status(400).json({
      success: false,
      message: 'El token ha expirado. Por favor, solicita un nuevo código.'
    });
  }

  // Buscar el usuario
  const user = await User.findById(tokenData.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Actualizar la contraseña (el pre-save hook la hasheará automáticamente)
  user.password = newPassword;
  await user.save();

  // Opcional: Eliminar todos los códigos de recuperación anteriores del usuario
  await PasswordReset.deleteMany({ user: user._id });

  res.status(200).json({
    success: true,
    message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.'
  });
});

/**
 * POST /api/v1/auth/resend-otp
 * Reenvía un nuevo código OTP (mismo flujo que forgot-password)
 */
export const resendOTP = asyncHandler(async (req, res) => {
  // Reutilizamos la lógica de forgotPassword
  return forgotPassword(req, res);
});

export default {
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP
};
