"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BasicModal from "@/modals/basic-modal";
import type { ApiResponse, UserAuthError } from "@/objects";
import { RecoverFormSchema, type RecoverFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { toast } from "../../components/ui/use-toast";

export function RecoverForm() {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const form = useForm<RecoverFromType>({
		resolver: yupResolver(RecoverFormSchema),
		defaultValues: {
			email: ""
		},
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<RecoverFromType> = async data => {
		setLoading(true);
		const response = await axios
			.post("/api/auth/recover", data)
			.catch(res => catchAxiosResponse(res, form))
			.then(res => handleAxiosResponse(res, form));

		if (response) setOpen(true);

		setLoading(false);
	};

	return (
		<div>
			<BasicModal
				title="Correo de recuperación enviado"
				description="Se ha enviado un correo de recuperación, revisa tu bandeja de entrada y spam para recuperar tu cuenta."
				open={open}
				onConfirm={() => {
					setOpen(false);
				}}
				loading={loading}
			/>
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
					<Button className="w-full" type="submit" loading={loading}>
						Solicitar recuperación
					</Button>
				</form>
			</Form>
		</div>
	);
}
