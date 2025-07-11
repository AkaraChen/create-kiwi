import fs from 'node:fs';
import path from 'node:path';
import enquirer from 'enquirer';
import { execa } from 'execa';
import * as rimraf from 'rimraf';
import { boom, getInstallScript, getPackageManager } from '../util';
import type { TemplatingStrategy } from './interface';

export class GitCloneTemplating implements TemplatingStrategy {
    private url: string;

    constructor(url: string) {
        this.url = url;
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
        await execa('git', ['clone', this.url, dir]).catch(() => {
            console.log(`git clone ${this.url} ${dir}`);
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
