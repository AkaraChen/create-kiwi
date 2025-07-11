import { ExecTemplating } from './exec-templating';
import { GitHubCloneTemplating } from './github-clone-templating';
import type { TemplatingStrategy } from './interface';

export const templates: Array<{
    message: string;
    name: string;
    strategy: TemplatingStrategy;
}> = [
    {
        message: 'package-starter',
        name: 'package-starter',
        strategy: new GitHubCloneTemplating('package-starter'),
    },
    {
        message: 'react-component-starter',
        name: 'react-component-starter',
        strategy: new GitHubCloneTemplating('react-component-starter'),
    },
    {
        message: 'turborepo-nextjs-hono-starter',
        name: 'turborepo-nextjs-hono-starter',
        strategy: new GitHubCloneTemplating('turborepo-nextjs-hono-starter'),
    },
    {
        message: 'nextjs-shadcn-template',
        name: 'nextjs-shadcn-template',
        strategy: new GitHubCloneTemplating('nextjs-shadcn-template'),
    },
    {
        message: 'effect-ts',
        name: 'effect-ts',
        strategy: new ExecTemplating('pnpx', ['create-effect-app']),
    },
    {
        message: 'mui-toolpad-nextjs',
        name: 'mui-toolpad-nextjs',
        strategy: new GitHubCloneTemplating('toolpad-next-template'),
    },
];
