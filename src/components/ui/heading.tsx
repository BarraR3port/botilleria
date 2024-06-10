"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "./button";

interface HeadingProps {
	title: string | React.ReactNode;
	mainPath?: string;
}

export default function Heading({ title, mainPath }: HeadingProps) {
	const router = useRouter();
	const pathName = usePathname();

	const showBackButton = useMemo(() => pathName !== mainPath && mainPath !== undefined, [pathName]);

	return (
		<div className="space-y-1">
			<div className="flex gap-2 items-center">
				{showBackButton && (
					<Button variant="outline" size="icon" className="h-8 w-8">
						<ChevronLeft
							onClick={() => {
								router.back();
							}}
							className="h-4 w-4"
						/>
						<span className="sr-only">Back</span>
					</Button>
				)}
				{typeof title === "string" ? <h2 className="text-3xl font-bold tracking-right">{title}</h2> : title}
			</div>
		</div>
	);
}
