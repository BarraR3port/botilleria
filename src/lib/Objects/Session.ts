export interface CurrentProject {
	uuid: string;
	date_created: Date;
}

export interface Session {
	uuid: string;
	current_project?: CurrentProject;
	changed: boolean;
	setChanged(changed: boolean): void;
	hasChanged(): boolean;
}
