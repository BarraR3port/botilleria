"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { triggerFireworks } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ApiResponse } from "@/objects";
import { ResetFormSchema, type ResetFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Recovery } from "@prisma/client";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "../../components/ui/use-toast";

interface ResetFormProps {
	email: string;
	recovery: Recovery;
}

export function ResetForm({ email, recovery }: ResetFormProps) {
	const [loading, setLoading] = useState(false);
	const [passwordHidden, setPasswordHidden] = useState(false);

	const form = useForm<ResetFromType>({
		resolver: yupResolver(ResetFormSchema),
		defaultValues: {
			email,
			password: "",
			confirmPassword: ""
		},
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<ResetFromType> = async data => {
		setLoading(true);
		const response = await axios
			.post("/api/auth/reset", {
				...data,
				recoveryId: recovery.id,
				email,
				token: recovery.token
			})
			.catch(res => catchAxiosResponse(res, form))
			.then(res => handleAxiosResponse(res, form));

		if (response) {
			triggerFireworks();
			const signInResponse = await signIn("credentials", {
				redirect: false,
				callbackUrl: "/panel",
				email,
				password: data.password
			}).catch(error => {
				console.log("|| Error", error);
				return error;
			});

			if (signInResponse) {
				if (signInResponse.ok && signInResponse.url) {
					window.location.href = signInResponse.url;
				}
				window.location.reload();
			}
		}

		setLoading(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									disabled
									id="email"
									placeholder="email@ejemplo.com"
									required
									autoComplete="email"
									type="email"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contraseña</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										disabled={loading}
										required
										type={passwordHidden ? "current-password" : "password"}
										autoComplete="off"
										autoSave={"password"}
										{...field}
									/>
									{passwordHidden ? (
										<EyeOff
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									) : (
										<Eye
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmar contraseña</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										disabled={loading}
										required
										type={passwordHidden ? "new-password" : "password"}
										autoComplete="new-password"
										autoSave={"new-password"}
										{...field}
									/>
									{passwordHidden ? (
										<EyeOff
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									) : (
										<Eye
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit" loading={loading}>
					Actualizar contraseña
				</Button>
			</form>
		</Form>
	);
}
