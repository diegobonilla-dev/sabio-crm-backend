// src/utils/emailService.js
import nodemailer from 'nodemailer';

// Configuración del transporter de Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

/**
 * Envía un email usando el template proporcionado
 * @param {Object} options - Opciones del email
 * @param {string} options.to - Email del destinatario
 * @param {string} options.subject - Asunto del email
 * @param {string} options.html - Contenido HTML del email
 * @returns {Promise<Object>} - Información del email enviado
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"SaBio CRM" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email enviado exitosamente:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error('No se pudo enviar el email. Por favor, intenta más tarde.');
  }
};

/**
 * Genera un código OTP de 6 dígitos
 * @returns {string} - Código OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default { sendEmail, generateOTP };
