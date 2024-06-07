"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ApiResponse, AuthResponse } from "@/objects";
import { SignInFormSchema, type SignInFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "../../components/ui/separator";
import { toast } from "../../components/ui/use-toast";

export function SignInForm() {
	const [loading, setLoading] = useState(false);

	const form = useForm<SignInFromType>({
		resolver: yupResolver(SignInFormSchema),
		defaultValues: {
			email: "",
			password: ""
		},
		reValidateMode: "onChange"
	});

	const [passwordHidden, setPasswordHidden] = useState(false);

	const onSubmit: SubmitHandler<SignInFromType> = async data => {
		setLoading(true);

		const response: AuthResponse = await axios
			.post("/api/auth/signIn", {
				...data
			})
			.catch(res => catchAxiosResponse(res, form))
			.then(res => handleAxiosResponse(res, form));

		if (typeof response === "object" && "user" in response) {
			const signInResponse = await signIn("credentials", {
				redirect: false,
				callbackUrl: "/panel",
				userId: response.user.id,
				token: response.backendTokens.accessToken.token
			}).catch(error => {
				console.log("|| Error", error);
				return error;
			});

			if (signInResponse) {
				if (signInResponse.ok && signInResponse.url) {
					window.location.href = signInResponse.url;
				}
			}
		}

		setLoading(false);
	};

	return (
		<div>
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
										disabled={loading}
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
											type={passwordHidden ? "text" : "password"}
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
						Ingresar
					</Button>
				</form>
			</Form>
			<Separator className="my-8">o</Separator>
			<Link className="flex items-center justify-center w-full py-2 text-sm underline" href="/recover">
				¿Se te olvidó tu contraseña?
			</Link>
		</div>
	);
}
