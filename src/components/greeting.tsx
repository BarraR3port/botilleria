"use client";

import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

export function Greeting() {
	// inspect console: Hello, World! You've been greeted from Rust!
	useEffect(() => {
		invoke("greet", { name: "World" }).then(console.log).catch(console.error);
	});

	return <></>;
}
