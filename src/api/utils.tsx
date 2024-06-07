import { toast } from "@/components/ui/use-toast";
import type { ApiResponse, AuthResponse, UserErrorResponse } from "@/objects";

export async function handleAxiosResponse(response: any, form?: any): Promise<ApiResponse> {
	if (!response) {
		return undefined;
	}
	console.log(" || NORMAL", response);

	const error: UserErrorResponse = response.data;
	if (typeof error === "object" && "errors" in error) {
		error.errors.forEach(errorMessage => {
			console.log(" || ERROR", errorMessage);
			form?.setError(errorMessage.type as any, { message: errorMessage.message });
			toast({
				title: errorMessage.message,
				variant: "destructive",
				duration: 1500
			});
		});
		return undefined;
	}

	if ("status" in response) {
		if (response.status === 200 || response.status === 201 || response.status === 204 || response.status === 304) {
			console.log(" || STATUS", response.status);
			return response.data;
		}
	}

	if ("data" in response && "status" in response.data) {
		if (
			response.data.status === 200 ||
			response.data.status === 201 ||
			response.data.status === 204 ||
			response.data.status === 304
		) {
			return response.data;
		}
	}

	return undefined;
}

export async function catchAxiosResponse(response: any, form?: any): Promise<ApiResponse> {
	if (!response) {
		return undefined;
	}

	const errorData: UserErrorResponse = response.response.data;
	if (typeof errorData === "object" && "errors" in errorData) {
		errorData.errors.forEach(errorMessage => {
			form?.setError(errorMessage.type as any, { message: errorMessage.message });
			toast({
				title: errorMessage.message,
				variant: "destructive",
				duration: 1500
			});
		});
		return undefined;
	}

	toast({
		title: "Ocurrió un error inesperado, por favor contactar soporte",
		variant: "destructive",
		duration: 1500
	});

	return undefined;
}
