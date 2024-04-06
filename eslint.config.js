import pluginJs from "@eslint/js";
import globals from "globals";
import prettier from "prettier";
import tseslint from "typescript-eslint";

export default [
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		rules: {
			semi: "error",
			"prefer-const": "error"
		}
	},
];
