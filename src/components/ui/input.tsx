import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	leftIcon?: React.ReactNode; // Nuevo prop para el icono
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, leftIcon, ...props }, ref) => {
	return (
		<div className="relative flex items-center">
			{leftIcon && (
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{leftIcon}</div>
			)}
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ", // Agregamos un padding a la izquierda para evitar que el texto se superponga con el icono
					leftIcon ? "pl-10" : "", // Agregamos padding a la izquierda si hay un icono
					className
				)}
				ref={ref}
				{...props}
			/>
		</div>
	);
});

Input.displayName = "Input";

export { Input };
