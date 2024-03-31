export interface Project {
	uuid: string;
	dateCreated: number;
	dateUpdated: number;
}

export interface Changelog {
	name: string;
	created_at: string;
	published_at: string;
	tag_name: string;
	body: string;
}

export async function getUUIDs(amount: number) {
	return fetch(`https://www.uuidgenerator.net/api/version1/${amount}`)
		.then(response => response.text())
		.then(uuids => uuids.replace("\r", "").split("\n"))
		.catch(errorFound => {
			console.error(errorFound);
			return ["", ""];
		});
}
