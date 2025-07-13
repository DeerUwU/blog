// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: 'https://offline-blog.neocities.org',
	integrations: [mdx(), sitemap()],

	trailingSlash: "ignore", //Set the route matching behavior for trailing slashes in the dev server and on-demand rendered pages.
	output: 'static', //Prerender all your pages by default, outputting a completely static site if none of your pages opt out of prerendering.
	compressHTML: false,

	experimental: {
        fonts: [{
            provider: fontProviders.google(),
            name: "DM Mono",
            cssVariable: "--font-DM-Mono"
        },
		{
            provider: fontProviders.google(),
            name: "Libre Barcode 39",
            cssVariable: "--font-Barcode-39"
        }]
    }
});
