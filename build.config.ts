import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: ['./src/index'],
    rollup: {
        esbuild: {
            target: 'es2022',
        },
    },
});
