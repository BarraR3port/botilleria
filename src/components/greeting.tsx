"use client";

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function Greeting() {
	const [_greetMsg, setGreetMsg] = useState("");
	const [name, _setName] = useState("");

	// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
	async function greet() {
		setGreetMsg(await invoke("greet", { name }));
	}

	// inspect console: Hello, World! You've been greeted from Rust!
	useEffect(() => {
		invoke("greet", { name: "World" }).then(console.log).catch(console.error);
	});

	return <></>;
}
