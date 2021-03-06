import postcss from 'postcss';
import safeParser from 'postcss-safe-parser';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import atImport from 'postcss-import';
import atUrl from 'postcss-url';

// Ensure custom URL resolution support gets bundled.
import('postcss-url/src/type/custom');

export interface PostConfig {

	importResolve: (importKey: string, baseKey: string) => string | Promise<string>;
	importLoad: (key: string) => string | Promise<string>;
	urlResolve: (importKey: string, baseKey: string) => string;
	minify?: boolean;

}

export class PostBuilder {

	constructor(public config: PostConfig) {
		if (config.minify) {
			this.pluginList.push(cssnano({
				preset: 'default'
			}));
		}
	}

	build(code: string, key: string) {
		return postcss(this.pluginList).process(code, {
			parser: safeParser,
			from: key,
			map: {
				annotation: false,
				inline: false,
				sourcesContent: true
			}
		}).then(({ css, map }) => ({ css, map: map as any }));
	}

	private pluginList: postcss.AcceptedPlugin[] = [
		atImport({
			resolve: this.config.importResolve,
			load: this.config.importLoad
		}),
		atUrl({
			url: ((asset: any, dir: any, opts: any, decl: any) =>
				this.config.urlResolve(asset.url, decl.source.input.file)
			) as atUrl.CustomTransformFunction
		}),
		autoprefixer
	];

}
