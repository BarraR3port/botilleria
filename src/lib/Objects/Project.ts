import { error } from "./LogManager";
import type { Skin, SkinJSON, SkinManifestJSON } from "./Skin";
import type { PackSpecificProps, WorldPack } from "./World";

export interface Project {
	uuid: string;
	dateCreated: number;
	dateUpdated: number;
	packType: PackType;
	worldPack: WorldPack | null;
	skinPack: SkinPack | null;
	texturePack: PackSpecificProps | null;
	steps: number[];
	currentStep: number;
	arts: Arts;
	paths: ProjectPaths;
	packAnalysis: PackAnalysis | null;
	creationType: CreationType;
}

export interface Art {
	path: string;
	virtual_path?: string;
	url_blob_path: string;
	file: File | null;
}

export enum CreationType {
	NEW = "new",
	IMPORT = "import",
	MIGRATION = "migration",
}

export type IconArtSize = "64x64" | "128x128" | "256x256" | "512x512";

export interface IconArt extends Art {
	size: IconArtSize;
}

export interface Arts {
	keyArt: Art | null;
	partnerArt: Art | null;
	panorama: Art | null;
	marketingArts: Art[] | null;
	storeArts: Art[] | null;
	packIcon: IconArt | null;
	thumbnail: Art | null;
	worldIcon: Art | null;
	resourcePackIcon: IconArt | null;
	behaviorPackIcon: IconArt | null;
}

export enum PackType {
	WORLD = "world",
	SKIN = "skin",
	TEXTURE_PACK = "texture",
	WORLD_SKIN = "world_skin",
	TEXTURE_SKIN = "texture_skin",
	MASHUP = "mashup",
	NONE = "none",
}

export type SkinResolution = "64x64" | "128x128" | "256x256" | "512x512" | "1024x1024" | null;

export interface SkinPack {
	skinList: Skin[];
	skinsJSON: SkinJSON;
	manifest: SkinManifestJSON;
	skinResolution: SkinResolution;
	texts: PackText[];
}

export type MinecraftBedrockVersion = {
	value: string;
	label: string;
};

export interface Changelog {
	name: string;
	created_at: string;
	published_at: string;
	tag_name: string;
	body: string;
}

export interface PackTextLanguage {
	key: string;
	value: string;
}

export type ImportPackType = "NORMAL" | "WORLD" | "SKIN";

export interface PackText {
	packTextLanguage: string;
	packName: string;
	packDescription: string;
	translations: PackTextLanguage[];
}

export async function getUUIDs(amount: number) {
	return fetch(`https://www.uuidgenerator.net/api/version1/${amount}`)
		.then(response => response.text())
		.then(uuids => uuids.replace("\r", "").split("\n"))
		.catch(errorFound => {
			error(errorFound);
			return ["", ""];
		});
}

export interface PackAnalysis {
	defaultPackName: string;
	isSkinPack: boolean;
	isTexturePack: boolean;
	isWorldPack: boolean;
	worldPackFilePaths: WorldPackFilePaths;
	hasBehaviorPack: boolean;
	behaviorPack: WorldPackPaths;
	hasResourcePack: boolean;
	resourcePack: WorldPackPaths;
	hasMarketingArts: boolean;
	hasStoreArts: boolean;
	skinPackPaths: SkinPackPaths;
}

export interface WorldPackFilePaths {
	levelName: string;
	textFiles: string[];
	manifest: string;
	textJson: string;
	world_icon: Art | null;
	world_resource_packs_json: string;
	world_behavior_packs_json: string;
	path: string;
}

export interface SkinPackPaths {
	skinFiles: string[];
	textFiles: string[];
	manifest: string;
	text_json: string;
	skins_json: string;
}

export interface WorldPackPaths {
	textFiles: string[];
	langJson: string;
	path: string;
	folderName: string;
	manifest: string;
	packIcon: Art | null;
}

export interface ProjectPaths {
	basePath: string;
	zipPath: string;
	outPath: string;
}

export interface PackImportResponse {
	response: string;
	error: boolean;
	error_message: string;
}

export function getPackTypeFromAnalysis(analysis: PackAnalysis | null): PackType {
	if (!analysis) {
		return PackType.NONE;
	}
	if (analysis.isSkinPack && analysis.isTexturePack && analysis.isWorldPack) {
		return PackType.MASHUP;
	}
	if (analysis.isSkinPack && analysis.isTexturePack) {
		return PackType.TEXTURE_SKIN;
	}
	if (analysis.isSkinPack && analysis.isWorldPack) {
		return PackType.WORLD_SKIN;
	}
	if (analysis.isTexturePack && analysis.isWorldPack) {
		return PackType.MASHUP;
	}
	if (analysis.isSkinPack) {
		return PackType.SKIN;
	}
	if (analysis.isTexturePack) {
		return PackType.TEXTURE_PACK;
	}
	if (analysis.isWorldPack) {
		return PackType.WORLD;
	}
	return PackType.NONE;
}
