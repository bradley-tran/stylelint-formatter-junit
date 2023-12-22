import typescript from '@rollup/plugin-typescript'

export default {
	input: 'stylelint-junit.ts',
	output: {
		file: 'build/index.js',
		format: 'cjs'
	},
	plugins: [typescript()],
	external: ['path', 'xmlbuilder2']
}
