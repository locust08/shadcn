# Project Brief

## Goal

Adapt the selected ShadCN Astro template into a landing page matching the business purpose, content, and visual direction of the reference website.

## Reference Website

```txt
https://business.ruangbestari.com.my/
```

## Source Selection Repo

```txt
locust08/shadcn-template-selection
```

The selection repo contains the original candidate templates, comparison instructions, rubric, and selected-template documentation.

## Final Working Repo

```txt
locust08/shadcn
```

This repo contains the copied selected template and is the only place where final implementation edits should happen.

## Workflow

1. Read the selection repo.
2. Confirm which template was selected and why.
3. Work only in this final repo.
4. Replace text first using the reference website content.
5. Preserve the current layout and component structure as much as possible.
6. Replace images only after the text pass is complete.
7. Make image replacements fit the section meaning, tone, color feel, and layout.
8. Run lint and build checks before finishing.

## Text Prompt

```txt
Help me read the website content and apply only the text to the current project. You may modify the replacement text, but make sure it stays aligned with the original page and has a similar character count to maintain visual consistency.
```

## Image Prompt

```txt
From the images folder, public/images:

These images are currently being used on the project page, but they are not yet aligned with the context of the new text input. I would like you to generate new images and replace the existing ones with images that better fit each section / DOM element. Please first plan which images would be most suitable to visually represent each section / bento/ block and also match the color tone, visual feel. These will be enhanced into the image generation prompt. Then proceed to generate all the required images. Then, convert the images to WebP format. And use the newly generated images into the project.
```
