import type { PackText } from "./Project";

export interface WorldPack {
	world?: WorldSpecificProps;
	behaviorPack?: PackSpecificProps;
	resourcePack?: PackSpecificProps;
}

export interface WorldManifestModule {
	version: number[];
	type: "world_template";
	uuid: string;
}

export interface PackDependency {
	pack_id: string;
	version: number[];
}

export type PackDependencyArray = PackDependency[];

export type WorldPackType = "WORLD" | "BEHAVIOR_PACK" | "RESOURCE_PACK";

export interface WorldSpecificProps {
	manifest: WorldManifestJSON;
	file: File | null;
	filePath: string;
	texts: PackText[];
}

export interface PackSpecificProps {
	manifest: BehaviorPackManifestJSON | ResourcePackManifestJSON;
	file: File | null;
	filePath: string;
	texts: PackText[];
}

export interface WorldManifestJSON {
	format_version: number;
	header: WorldManifestHeader;
	modules: PackManifestModule[];
	metadata: WorldManifestMetadata;
}

export type Dependency = UUIDDependency | ModuleDependency;

export interface UUIDDependency {
	uuid: string;
	version: number[];
}
export interface ModuleDependency {
	module_name: string;
	version: string;
}

export interface BehaviorPackManifestJSON {
	format_version: number;
	header: PackManifestHeader;
	modules: PackManifestModule[];
	dependencies: Dependency[];
}

export interface ResourcePackManifestJSON {
	format_version: number;
	header: PackManifestHeader;
	modules: PackManifestModule[] | ScriptPackManifestModule[];
	dependencies: Dependency[];
}

export interface RpManifestDependencies {
	uuid: string;
	version: number[];
}

export interface WorldManifestHeader {
	name: string;
	description: string;
	uuid: string;
	version: number[];
	base_game_version: number[];
	lock_template_options: boolean;
}

export interface PackManifestHeader {
	name: "pack.name";
	description: "pack.description";
	uuid: string;
	version: number[];
	min_engine_version: number[];
}

export interface PackManifestModule {
	uuid: string;
	version: number[];
	type: "data" | "resources" | "world_template" | "script";
}

export interface ScriptPackManifestModule extends PackManifestModule {
	language: string;
	entry: string;
}

export interface WorldManifestMetadata {
	authors: string[];
}
