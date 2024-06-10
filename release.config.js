module.exports = {
	branches: ["main", { name: "beta", prerelease: true }],
	plugins: [
		[
			"@semantic-release/commit-analyzer",
			{
				preset: "conventionalcommits"
			}
		],
		[
			"@semantic-release/release-notes-generator",
			{
				preset: "conventionalcommits",
				presetConfig: {
					types: [
						{
							type: "feat",
							section: ":sparkles: Features",
							hidden: false
						},
						{
							type: "fix",
							section: ":bug: Fixes",
							hidden: false
						},
						{
							type: "docs",
							section: ":memo: Documentation",
							hidden: false
						},
						{
							type: "ci",
							section: ":repeat: CI",
							hidden: false
						},
						{
							type: "chore",
							section: ":broom: Chore",
							hidden: false
						}
					]
				}
			}
		],
		[
			"semantic-release-replace-plugin",
			{
				replacements: [
					{
						files: ["package.json"],
						from: '"version": ".*"',
						to: '"version": "${nextRelease.version}"'
					},
					{
						files: ["src-tauri/Cargo.toml"],
						from: '^version = ".*"',
						to: 'version = "${nextRelease.version}"'
					}
				]
			}
		],
		[
			"@semantic-release/git",
			{
				assets: ["src-tauri/Cargo.toml", "package.json", "CHANGELOG.md"],
				message: "chore(release): ${nextRelease.version}"
			}
		],
		["@semantic-release/github"]
	]
};
