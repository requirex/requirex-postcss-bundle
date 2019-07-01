declare module 'postcss-safe-parser' {
	import { Parser } from 'postcss';

	const parser: Parser;
	export = parser;
}

declare module 'postcss-import' {
	import { AcceptedPlugin } from 'postcss';

	interface ImportConfig {
		filter?: () => boolean;
		root?: string;
		path?: string | string[];
		plugins?: AcceptedPlugin[];
		resolve?: (key: string, dir: string, config?: ImportConfig) => string | Promise<string>;
		load?: (key: string, config?: ImportConfig) => string | Promise<string>;
		skipDuplicates?: boolean;
		addModulesDirectories?: string[];
	}

	const create: (config: ImportConfig) => AcceptedPlugin;
	export = create;
}

declare module 'postcss-url/src/type/custom' {}
