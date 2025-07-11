export interface TemplatingStrategy {
    create(cwd: string): Promise<void>;
}
