import prompts from 'prompts';
import consola from 'consola';
import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import {
    boom, onCancel, getPackageManager, getInstallScript
} from './util';
import rimraf from 'rimraf';

const cwd = process.cwd();
const packageManager = getPackageManager();

async function main() {
    await execa('git', ['-v']).catch(() => {
        boom('Git not found in your machine.');
    });
    const { dir } = await prompts({
        type: 'text',
        name: 'dir',
        message: 'Please input project name.',
        validate: (value: string) => {
            const directory = path.resolve(cwd, value);
            consola.log(directory);
            if (!fs.existsSync(directory)) return true;
            if (fs.readdirSync(directory)) {
                consola.error(`${directory} is already existed.`);
                return false;
            }
            return true;
        }
    }, { onCancel });
    const directory = path.resolve(cwd, dir);
    if (!fs.existsSync(directory)) rimraf.sync(directory);
    const { template } = await prompts({
        type: 'select',
        name: 'template',
        message: 'Pick templates',
        choices: [
            { title: 'Vite Vue', value: 'vite-vue-starter' },
            { title: 'Webpack React', value: 'webpack-react-starter' },
            { title: 'Package', value: 'package-starter' },
            { title: 'Package Rollup', value: 'package-starter-rollup' },
            { title: 'tRPC', value: 'trpc-starter' }
        ]
    }, { onCancel });
    const repo = `https://github.com/akarachen/${template}.git`;
    await execa('git', ['clone', repo, dir]).catch(() => {
        boom('Clone repo failed.');
    });
    rimraf.sync(path.resolve(directory, '.git'));
    consola.success(`Initialize project ${dir} success. Now run:\n`);
    console.log(`   cd ${dir}`);
    console.log(`   ${getInstallScript(packageManager)}`);
    console.log(`   ${packageManager} run dev`);
}

await main();
