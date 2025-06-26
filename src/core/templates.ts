import { ExecTemplating } from './exec-templating';
import { GitCloneTemplating } from './git-clone-templating';
import type { TemplatingStrategy } from './interface';

export const templates: Array<{
    message: string;
    name: string;
    strategy: TemplatingStrategy;
}> = [
    {
        message: 'package-starter',
        name: 'package-starter',
        strategy: new GitCloneTemplating('Simple Package', 'package-starter'),
    },
    {
        message: 'react-component-starter',
        name: 'react-component-starter',
        strategy: new GitCloneTemplating(
            'React Component Library',
            'react-component-starter',
        ),
    },
    {
        message: 'turborepo-nextjs-hono-starter',
        name: 'turborepo-nextjs-hono-starter',
        strategy: new GitCloneTemplating(
            'Turborepo Next.js Hono Monorepo',
            'turborepo-nextjs-hono-starter',
        ),
    },
    {
        message: 'nextjs-shadcn-template',
        name: 'nextjs-shadcn-template',
        strategy: new GitCloneTemplating(
            'Next.js + ShadCN UI',
            'nextjs-shadcn-template',
        ),
    },
    {
        message: 'effect-ts',
        name: 'effect-ts',
        strategy: new ExecTemplating('Effect CLI App', 'pnpx', [
            'create-effect-app',
        ]),
    },
];
