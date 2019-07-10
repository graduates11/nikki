module.exports = {
	env: {
		browser: true,
		node: true,
		jest: true,
		es6: true
	},
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018,
		sourceType: "module"
	},
	plugins: ["react", "prettier"],
	rules: {
		"prettier/prettier": "error",
		indent: ["error", 2],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		// semi: ["error", "never"],
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
		"no-console": 1
	},
	settings: {
		react: {
			version: require("./package.json").dependencies.react
		}
	}
}
