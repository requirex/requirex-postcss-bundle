import * as postcss from 'postcss';
import * as safeParser from 'postcss-safe-parser';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';
import * as atImport from 'postcss-import';
import * as atUrl from 'postcss-url';

// Ensure custom URL resolution support gets bundled.
import('postcss-url/src/type/custom');

export interface PostConfig {
	importResolve: (key: string, dir: string) => string | Promise<string>;
	importLoad: (key: string) => string | Promise<string>;
	urlResolve: (key: string, isLocal: boolean) => string;
	minify?: boolean;
}

export class PostBuilder {

	constructor(public config: PostConfig) {
		if(config.minify) {
			this.pluginList.push(cssnano({
				preset: 'default'
			}));
		}
	}

	build(key: string, baseKey: string) {
		return postcss(this.pluginList).process('@import "' + key + '"', {
			parser: safeParser,
			from: baseKey,
			map: {
				inline: false,
				sourcesContent: false
			}
		}).then((result) => result.css);
	}

	private pluginList: postcss.AcceptedPlugin[] = [
		atImport({
			resolve: this.config.importResolve,
			load: this.config.importLoad
		}),
		atUrl({
			url: ((asset) => {
				const isLocal = !!asset.pathname;
				return this.config.urlResolve(isLocal ? asset.absolutePath! : asset.url, isLocal);
			}) as atUrl.CustomTransformFunction
		}),
		autoprefixer
	];

}
