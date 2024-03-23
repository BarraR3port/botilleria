"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import * as React from "react";

export function StyleSwitcher() {
	const segments = useSelectedLayoutSegments();

	React.useEffect(() => {
		document.body.removeAttribute("data-section");

		const section = segments.at(-1);
		if (section && typeof window !== "undefined") {
			document.body.setAttribute("data-section", section);
		}
	}, [segments]);

	return null;
}
