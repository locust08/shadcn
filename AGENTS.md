# Final Project Workflow

This repository is the final working project for `locust08/shadcn`.

The source selection repo is:

```txt
locust08/shadcn-template-selection
```

Before major edits, read the selection repo instructions and docs when available:

- `AGENTS.md`
- `reference.md`
- `evaluation-rubric.md`
- `docs/comparison-report.md`
- `docs/selected-template.md`
- `docs/implementation-plan.md`

## Base Template Rule

This project must remain based on the selected template copied from `locust08/shadcn-template-selection`.

Do not rebuild from scratch.
Do not replace the project with a new Astro app.
Do not mix unrelated templates.
Preserve the selected template structure unless a change is required for the reference website.

## Editing Order

1. Apply text changes first.
2. Keep replacement text aligned with the reference website.
3. Keep similar character count and content density where possible so the layout stays balanced.
4. Do not replace images during the text pass.
5. After text is stable, inspect used images in `public/images`.
6. Plan image replacements by section, block, card, or DOM element.
7. Generate or replace images after the image plan is clear.
8. Convert generated images to WebP before wiring them into the project.

## Reference Website

Use the reference URL in `project-brief.md`.

## Verification

After meaningful edits, run:

```txt
pnpm run lint
pnpm run build
```

Fix issues where practical and report any remaining warnings.
