import consola from 'consola';

export const boom = (message: string) => {
    const error = new Error(message);
    consola.error(error);
    process.exit(1);
};
