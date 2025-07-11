import pkg from '../../package.json';
import { GitCloneTemplating } from './git-clone-templating';

export class GitHubCloneTemplating extends GitCloneTemplating {
    constructor(input: string) {
        let repo: string;
        let owner: string = pkg.author.name;
        if (input.split('/').length > 2) {
            owner = input.split('/')[1];
            repo = input.split('/')[2];
        } else {
            repo = input;
        }
        super(new URL(`${owner}/${repo}.git`, 'https://github.com').href);
    }
}
