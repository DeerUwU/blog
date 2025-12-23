// @ts-check
import mdx from '@astrojs/mdx';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import { defineConfig, fontProviders } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";

// https://rehype-pretty.pages.dev/
const prettyCodeOptions = {
        theme: 'catppuccin-mocha',
        grid: true,
        keepBackground: false,
        onVisitHighlightedLine(node) {
            node?.properties?.className?.push("highlighted");
        },
        onVisitHighlightedChars(node) {
            console.log(node);
            node?.properties?.className
            ? node.properties.className.push("highlighted-chars")
            : (node.properties.className = ["highlighted-chars"]);
        },
        transformers: [
            transformerCopyButton({
                visibility: 'always',
                feedbackDuration: 3_000,
            }),
        ],
        tokensMap: {},
    };


// https://astro.build/config
export default defineConfig({
	//site: 'https://deeruwu.github.io',
	site: 'https://blog.cakeeh.art',
	// integrations: [mdx(), sitemap()],
	integrations: [mdx()],

	trailingSlash: "ignore", //Set the route matching behavior for trailing slashes in the dev server and on-demand rendered pages.
	output: 'static', //Prerender all your pages by default, outputting a completely static site if none of your pages opt out of prerendering.
	compressHTML: true,



    

    markdown: {
        syntaxHighlight: false,
        rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
        shikiConfig: {
            theme: 'catppuccin-mocha'
        },
    },

    

	experimental: {
        fonts: [{
            provider: fontProviders.google(),
            name: "DM Mono",
            cssVariable: "--font-DM-Mono"
        },
        {
            provider: fontProviders.google(),
            name: "DM Sans",
            cssVariable: "--font-DM-Sans"
        },
		{
            provider: fontProviders.google(),
            name: "Libre Barcode 39",
            cssVariable: "--font-Barcode-39"
        }]
    }
});
