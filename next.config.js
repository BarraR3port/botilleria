/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		unoptimized: true,
		domains: ["avatars.githubusercontent.com", "images.unsplash.com", "botilleria-admin.vercel.app"]
	},
	output: "export",
	distDir: "dist",
	env: {
		API_URL: "https://botilleria-admin.vercel.app"
	}
};

module.exports = nextConfig;
