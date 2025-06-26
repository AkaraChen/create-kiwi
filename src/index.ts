import fs from 'node:fs';
import path from 'node:path';
import enquirer from 'enquirer';
import { execa } from 'execa';
import * as rimraf from 'rimraf';
import { boom, getInstallScript, getPackageManager } from './util';

const cwd = process.cwd();
const packageManager = getPackageManager();

await execa('git', ['-v']).catch(() => {
    boom('Git not found in your machine.');
});

const inputs = await enquirer.prompt<{
    dir: string;
    template: string;
}>([
    {
        type: 'input',
        name: 'dir',
        message: 'Please input project name.',
        initial: 'my-project',
        validate: (value: string) => {
            const directory = path.resolve(cwd, value);
            if (!fs.existsSync(directory)) {
                return true;
            }
            if (fs.readdirSync(directory).length > 0) {
                console.log(`${directory} is not empty.`);
                return `${directory} is already existed.`;
            }
        },
    },
    {
        type: 'select',
        name: 'template',
        message: 'Pick templates',
        choices: [
            'package-starter',
            'react-component-starter',
            'turborepo-nextjs-hono-starter',
            'starter-cli',
            'nextjs-shadcn-template',
        ],
    },
]);

const { dir, template } = inputs;

const directory = path.resolve(cwd, dir);

const repo = `https://github.com/akarachen/${template}.git`;
await execa('git', ['clone', repo, dir]).catch(() => {
    console.log(`git clone ${repo} ${dir}`);
    boom('Clone repo failed.');
});

const { install } = await enquirer.prompt<{
    install: boolean;
}>({
    type: 'confirm',
    message: 'Would you like to install deps?',
    name: 'install',
});

if (install) {
    try {
        await execa(packageManager, [getInstallScript(packageManager)], {
            cwd: directory,
            stdio: 'ignore',
        });
    } catch {
        boom('Install failed.');
    }
}

rimraf.sync(path.resolve(directory, '.git'));
