// src/templates/resetPasswordEmail.js

/**
 * Template reutilizable para el email de recuperación de contraseña
 * @param {Object} data - Datos para el template
 * @param {string} data.userName - Nombre del usuario
 * @param {string} data.otp - Código OTP de 6 dígitos
 * @param {number} data.expirationMinutes - Minutos de expiración (default: 5)
 * @returns {string} - HTML del email
 */
export const resetPasswordEmailTemplate = ({ userName, otp, expirationMinutes = 5 }) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recupera tu Acceso - SaBio</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Contenedor principal -->
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

              <!-- Header con logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                  <div style="background-color: #ffffff; width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                    <span style="font-size: 32px; font-weight: 700; color: #10b981; font-family: 'Georgia', serif;">SaBio</span>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Recupera tu Acceso</h1>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.5;">
                    Hola <strong>${userName}</strong>,
                  </p>

                  <p style="margin: 0 0 30px; color: #6b7280; font-size: 15px; line-height: 1.6;">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en SaBio CRM. Utiliza el siguiente código de verificación para continuar:
                  </p>

                  <!-- Código OTP -->
                  <div style="background: linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%); border: 2px dashed #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="margin: 0 0 10px; color: #059669; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Tu código de verificación
                    </p>
                    <div style="font-size: 36px; font-weight: 700; color: #047857; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </div>
                  </div>

                  <!-- Información de seguridad -->
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 6px; margin: 30px 0;">
                    <div style="display: flex; align-items: flex-start;">
                      <div style="margin-right: 12px;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#f59e0b" stroke-width="2"/>
                          <path d="M10 6V10" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                          <circle cx="10" cy="13" r="0.5" fill="#f59e0b" stroke="#f59e0b"/>
                        </svg>
                      </div>
                      <div>
                        <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 600;">
                          Aviso de seguridad
                        </p>
                        <p style="margin: 5px 0 0; color: #78350f; font-size: 13px; line-height: 1.5;">
                          Este código expira en <strong>${expirationMinutes} minutos</strong> y solo puede usarse una vez. Si superás 3 intentos fallidos, deberás solicitar un nuevo código.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Si no solicitaste este cambio, ignora este correo. Tu contraseña permanecerá segura.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                    Este es un correo automático, por favor no responder.
                  </p>
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    © ${new Date().getFullYear()} SaBio - Agricultura Regenerativa
                  </p>
                  <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                    <a href="mailto:soporte@sabio.com.co" style="color: #10b981; text-decoration: none;">
                      ¿Necesitas ayuda? Contáctanos
                    </a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default resetPasswordEmailTemplate;
