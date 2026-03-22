# Project-Specific Instructions: shivansh.life

## UI & Theming (macOS Yosemite Retro Style)
- **Theme**: This project strictly follows the macOS OS X Yosemite (10.10) design language.
- **Do NOT disturb the current UI theming**. Maintain the specific gradients, blurs (`backdrop-filter`), window borders, and drop shadows defined in `app/globals.css`.
- **Colors**: Use the CSS variables defined in `globals.css` (e.g., `--color-bg-window`, `--color-accent`, `--color-text-primary`).

## Icons
- **Source**: ONLY use the authentic macOS Yosemite icons located in `public/yosemite-icons/`.
- **Rule**: Do NOT import icons from external libraries (like `lucide-react`, `react-icons`, etc.) or other folders.
- **Missing Icons**: If a required icon is missing, **ask the user** to provide it first. Do not source or guess icons yourself.

## Sound Design
- **Engine**: UI interaction sounds are powered by `Tone.js` via the `useRetroSound` hook (`app/components/hooks/useRetroSound.ts`).
- **Usage**: Ensure new interactive elements (buttons, dock items, windows) trigger the appropriate sound methods (e.g., `playHover()`, `playClick()`, `playWindowOpen()`).

## Workflow & Changes
- **Verify First**: Always ask and verify what changes need to be made before executing them.
- **Small Steps**: Make deliberate, verified changes rather than sweeping unprompted modifications.

## Tech Stack Notes
- **Next.js**: Version 16+ (Turbopack).
- **React**: Version 19.
- **Styling**: Tailwind CSS v4 + custom CSS (`app/globals.css`).
- **State**: Standard React hooks (`useState`, `useRef`, `useCallback`). Avoid unnecessary re-renders.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->