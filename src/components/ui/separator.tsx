"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & { children?: React.ReactNode }
>(({ className, orientation = "horizontal", decorative = true, children, ...props }, ref) => (
	<div className={cn("relative", className)}>
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]")}
			{...props}
		/>
		{children && (
			<div className="absolute p-2 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-background">
				{children}
			</div>
		)}
	</div>
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
