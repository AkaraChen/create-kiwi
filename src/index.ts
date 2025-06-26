import enquirer from "enquirer";
import { execa } from "execa";
import { boom } from "./util";
import { templates } from "./core/templates";

const cwd = process.cwd();

await execa("git", ["-v"]).catch(() => {
  boom("Git not found in your machine.");
});

const inputs = await enquirer.prompt<{
  template: string;
}>([
  {
    type: "select",
    name: "template",
    message: "Pick templates",
    choices: templates.map((t) => ({ message: t.message, name: t.name })),
  },
]);

const { template } = inputs;

const selectedTemplate = templates.find((t) => t.name === template);

if (!selectedTemplate) {
  boom("Invalid template selected.");
}

await selectedTemplate.strategy.create(cwd);
