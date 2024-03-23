import { type InferType, object, string } from "yup";

export const SignInFormSchema = object({
	email: string().required("auth.errors.email.required").email("auth.errors.email.invalid").trim(),
	password: string()
		.required("auth.errors.password.required")
		.min(6, "auth.errors.password.minLength")
		.max(50, "auth.errors.password.maxLength")
		.trim(),
});

export type SignInFromType = InferType<typeof SignInFormSchema>;

export const SignUpFormSchema = object({
	email: string().required("auth.errors.email.required").email("auth.errors.email.invalid").trim(),
	password: string()
		.required("auth.errors.password.required")
		.min(6, "auth.errors.password.minLength")
		.max(50, "auth.errors.password.maxLength")
		.trim(),
	confirmPassword: string()
		.required("auth.errors.password.required")
		.min(6, "auth.errors.password.minLength")
		.max(50, "auth.errors.password.maxLength")
		.trim(),
	firstName: string()
		.required("auth.errors.firstName.required")
		.min(2, "auth.errors.firstName.minLength")
		.max(50, "auth.errors.firstName.maxLength")
		.trim(),
	lastName: string()
		.optional()
		.min(2, "auth.errors.lastName.minLength")
		.max(50, "auth.errors.lastName.maxLength")
		.trim(),
	company: string()
		.optional()
		.min(2, "auth.errors.company.minLength")
		.max(50, "auth.errors.company.maxLength")
		.trim(),
	lang: string().required("auth.errors.lang.required").oneOf(["en", "es"], "auth.errors.lang.invalid"),
});

export type SignUpFromType = InferType<typeof SignUpFormSchema>;

export const UpdateBasicUserInfoFormSchema = object({
	firstName: string()
		.required("auth.errors.firstName.required")
		.min(2, "auth.errors.firstName.minLength")
		.max(50, "auth.errors.firstName.maxLength")
		.trim(),
	lastName: string()
		.optional()
		.min(2, "auth.errors.lastName.minLength")
		.max(50, "auth.errors.lastName.maxLength")
		.trim(),
	lang: string().required("auth.errors.lang.required").oneOf(["en", "es"], "auth.errors.lang.invalid"),
});

export type UpdateBasicUserInfoFormType = InferType<typeof UpdateBasicUserInfoFormSchema>;

export const UpdateCriticalUserInfoFormSchema = object({
	company: string()
		.optional()
		.min(2, "auth.errors.company.minLength")
		.max(50, "auth.errors.company.maxLength")
		.trim(),
	password: string()
		.required("auth.errors.password.required")
		.min(6, "auth.errors.password.minLength")
		.max(50, "auth.errors.password.maxLength")
		.trim(),
	confirmPassword: string()
		.required("auth.errors.password.required")
		.min(6, "auth.errors.password.minLength")
		.max(50, "auth.errors.password.maxLength")
		.trim(),
});

export type UpdateCriticalUserInfoFormType = InferType<typeof UpdateCriticalUserInfoFormSchema>;

export const VerifyUserEmailSchema = object({
	token: string()
		.min(1, "auth.errors.email.verification.minCharacters")
		.max(6, "auth.errors.email.verification.maxCharacters")
		.trim(),
});

export type VerifyUserEmailType = InferType<typeof VerifyUserEmailSchema>;
