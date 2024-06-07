import { type InferType, object, string } from "yup";

export const SignInFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim(),
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim()
});

export type SignInFromType = InferType<typeof SignInFormSchema>;

export const RecoverFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim()
});

export type RecoverFromType = InferType<typeof RecoverFormSchema>;

export const ResetFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim(),
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim(),
	confirmPassword: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim()
});

export type ResetFromType = InferType<typeof ResetFormSchema>;

export const EmailOtpSchema = object({
	token: string()
		.required("El código de verificación es requerido")
		.min(1, "El código de verificación debe tener 6 caracteres")
		.max(6, "El código de verificación debe tener 6 caracteres")
		.trim()
});

export type EmailOtpType = InferType<typeof EmailOtpSchema>;
