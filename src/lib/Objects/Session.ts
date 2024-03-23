import type { PackType, SkinPack } from "./Project";
import type { PackSpecificProps, WorldPack } from "./World";

export interface CurrentProject {
	uuid: string;
	current_editing_pack: PackType;
	date_created: Date;
}

export interface Session {
	uuid: string;
	current_project?: CurrentProject;
	changed: boolean;
	setChanged(changed: boolean): void;
	hasChanged(): boolean;
}

export interface SidebarStep {
	title: string[];
	stepsPath: string[];
	color: string;
}

export const DEFAULT_SKIN_PACK: SkinPack = {
	manifest: {
		format_version: 2,
		header: {
			name: "pack.name",
			uuid: "",
			version: [1, 0, 0]
		},
		modules: [
			{
				type: "skin_pack",
				uuid: "",
				version: [1, 0, 0]
			}
		]
	},
	skinList: [],
	skinsJSON: {
		skins: [],
		serialize_name: "",
		localization_name: ""
	},
	skinResolution: null,
	texts: [
		{
			packTextLanguage: "en_US.lang",
			packName: "",
			packDescription: "",
			translations: []
		}
	]
};

export const DEFAULT_WORLD_PACK: WorldPack = {
	world: {
		file: null,
		filePath: "",
		texts: [
			{
				packTextLanguage: "en_US.lang",
				packName: "",
				packDescription: "",
				translations: []
			}
		],
		manifest: {
			format_version: 2,
			header: {
				name: "pack.name",
				description: "pack.description",
				version: [1, 0, 0],
				uuid: "",
				lock_template_options: true,
				base_game_version: []
			},
			modules: [
				{
					type: "world_template",
					uuid: "",
					version: [1, 0, 0]
				}
			],
			metadata: {
				authors: ["Packager by Waypoint"]
			}
		}
	}
};

export const DEFAULT_TEXTURE_PACK: PackSpecificProps = {
	file: null,
	filePath: "",
	texts: [
		{
			packTextLanguage: "en_US.lang",
			packName: "",
			packDescription: "",
			translations: []
		}
	],
	manifest: {
		format_version: 2,
		header: {
			description: "pack.description",
			name: "pack.name",
			uuid: "",
			version: [1, 0, 0],
			min_engine_version: []
		},
		modules: [
			{
				type: "resources",
				uuid: "",
				version: [1, 0, 0]
			}
		],
		dependencies: []
	}
};

Object.freeze(DEFAULT_SKIN_PACK);
Object.freeze(DEFAULT_WORLD_PACK);
Object.freeze(DEFAULT_TEXTURE_PACK);
