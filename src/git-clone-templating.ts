import fs from 'node:fs';
import path from 'node:path';
import enquirer from 'enquirer';
import { execa } from 'execa';
import * as rimraf from 'rimraf';
import type { TemplatingStrategy } from './templating-strategy';
import { boom, getInstallScript, getPackageManager } from './util';

export class GitCloneTemplating implements TemplatingStrategy {
    name: string;
    private template: string;

    constructor(name: string, template: string) {
        this.name = name;
        this.template = template;
    }

    async create(cwd: string): Promise<void> {
        const { dir } = await enquirer.prompt<{
            dir: string;
        }>({
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
        });

        const directory = path.resolve(cwd, dir);
        const repo = `https://github.com/akarachen/${this.template}.git`;
        await execa('git', ['clone', repo, dir]).catch(() => {
            console.log(`git clone ${repo} ${dir}`);
            boom('Clone repo failed.');
        });
        rimraf.sync(path.resolve(directory, '.git'));

        const packageManager = getPackageManager();
        const { install } = await enquirer.prompt<{
            install: boolean;
        }>({
            type: 'confirm',
            message: 'Would you like to install deps?',
            name: 'install',
        });

        if (install) {
            try {
                await execa(
                    packageManager,
                    [getInstallScript(packageManager)],
                    {
                        cwd: directory,
                        stdio: 'ignore',
                    },
                );
            } catch {
                boom('Install failed.');
            }
        }
    }
}
