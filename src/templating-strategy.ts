export interface TemplatingStrategy {
    name: string;
    create(cwd: string): Promise<void>;
}
