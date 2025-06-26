import { execa } from 'execa';
import type { TemplatingStrategy } from './templating-strategy';
import { boom } from './util';

export class ExecTemplating implements TemplatingStrategy {
    name: string;
    private command: string;
    private args: string[];

    constructor(name: string, command: string, args: string[] = []) {
        this.name = name;
        this.command = command;
        this.args = args;
    }

    async create(cwd: string): Promise<void> {
        await execa(this.command, this.args, { cwd, stdio: 'inherit' }).catch(
            () => {
                boom(`Failed to execute ${this.command}.`);
            },
        );
    }
}
