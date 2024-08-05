import fs from 'node:fs';
import path from 'node:path';
/* eslint-disable unicorn/prevent-abbreviations */
import { confirm, intro, outro, select, spinner, text } from '@clack/prompts';
import consola from 'consola';
import { execa } from 'execa';
import rimraf from 'rimraf';
import { boom, getInstallScript, getPackageManager, onCancel } from './util';

const cwd = process.cwd();
const packageManager = getPackageManager();

await execa('git', ['-v']).catch(() => {
    boom('Git not found in your machine.');
});

intro('create-kiwi');

const dir = (await text({
    message: 'Please input project name.',
    validate: (value: string) => {
        const directory = path.resolve(cwd, value);
        consola.log(directory);
        if (!fs.existsSync(directory)) return;
        if (fs.readdirSync(directory)) {
            return `${directory} is already existed.`;
        }
    },
})) as string;
onCancel(dir);

const directory = path.resolve(cwd, dir);
if (!fs.existsSync(directory)) rimraf.sync(directory);
const template = (await select({
    message: 'Pick templates',
    options: [
        { title: 'Package', value: 'package-starter' },
        { title: 'React component library', value: 'react-component-starter' },
        {
            title: 'Turborepo nextjs hono starter',
            value: 'turborepo-nextjs-hono-starter',
        },
        { title: 'CLI', value: 'starter-cli' },
    ],
})) as string;
onCancel(template);

const repo = `https://github.com/akarachen/${template}.git`;
await execa('git', ['clone', repo, dir]).catch(() => {
    boom('Clone repo failed.');
});

const install = (await confirm({
    message: 'Would you like to install deps?',
})) as boolean;
onCancel(install);
if (install) {
    const spin = spinner();
    spin.start(`Installing via ${packageManager}`);
    try {
        await execa(packageManager, [getInstallScript(packageManager)], {
            cwd: directory,
            stdio: 'ignore',
        });
    } catch {
        boom('Install failed.');
    } finally {
        spin.stop('Install success.');
    }
}

rimraf.sync(path.resolve(directory, '.git'));
outro(`Initialize project ${dir} success.`);
