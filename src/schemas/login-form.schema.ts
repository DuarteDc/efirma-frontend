import { z } from "zod";
const rfcRegex =
  /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{2})([A\d])$/i;

export const LoginFormSchema = z.object({
  rfc: z
    .string()
    .min(12, "El RFC no es valido")
    .max(13, "El RFC es demasiado grande")
    .refine((s) => rfcRegex.test(s.trim()), {
      message: "RFC inválido.",
    }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener más de 5 caracteres." }),
  certificate: z
    .any()
    .refine((f): f is File => f instanceof File, {
      message: "Debes seleccionar un archivo válido.",
    })
    .refine((f) => f && /\.cer$/i.test(f.name), {
      message: "El archivo debe tener extensión .cer",
    }),
});
