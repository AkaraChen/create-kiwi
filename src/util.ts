import { isCancel } from '@clack/prompts';
import consola from 'consola';

export const boom = (message: string) => {
    const error = new Error(message);
    consola.error(error);
    process.exit(1);
};

export function onCancel(signal: any) {
    if (isCancel(signal)) {
        boom('Operation Canceled.');
    }
}

enum PackageManager {
    yarn = 'yarn',
    pnpm = 'pnpm',
    npm = 'npm'
}

export function getPackageManager(): PackageManager {
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
        if (userAgent.startsWith('yarn')) {
            return PackageManager.yarn;
        } if (userAgent.startsWith('pnpm')) {
            return PackageManager.pnpm;
        }
    }
    return PackageManager.npm;
}

export function getInstallScript(packageManager: PackageManager) {
    switch (packageManager) {
        case PackageManager.pnpm: {
            return 'install';
        }
        case PackageManager.yarn: {
            return '';
        }
        default: {
            return 'install';
        }
    }
}
