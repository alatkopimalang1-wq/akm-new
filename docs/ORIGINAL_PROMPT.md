# Original Prompt (source of truth)

> Every agent / sub-agent MUST read this file (and `docs/IMPLEMENTATION_PLAN.md`
> once it exists) before writing any code in this repository.

Received: 2026-10-22. Reproduced verbatim below (the user pasted the core
request several times; duplicates are collapsed into one copy, nothing else
is changed).

---

```text
Understand https://nircoffee.id/ works, how many pages they have  show me the evidence, and build a
similar feature for my project.

use single script to run you check so i did not double check/confirm anything,
use https://sanubariroastery.id/ as content replacements,
/grill-with-docs

create implimentations plan from start to ending, only for user or public access, let me determine how the administration like wordpress backend you did not worry about it, for now just replace with dummy data but use https://sanubariroastery.id/ as references

even you can create sub project too use as reference in main laravel app to copy public facing data and pages

Set up https://github.com/JCodesMore/ai-website-cloner-template
as a standalone project in a new folder on my computer.
Ask me where to put it. Clone the repository, remove its origin remote,
install dependencies, and run npm run check. Leave it ready for me
to clone a website.

write this original promopt so on this project all of agents/sub-agent read the original plan before writing any codes
```

---

## Interpreted requirements (checklist)

1. Analyse how https://nircoffee.id/ works and **count its pages, with evidence**.
2. All checks are done by **one script** that runs without manual confirmation.
3. Build a **similar public-facing site** in this Laravel + Inertia + React + TS app.
4. **Content** comes from https://sanubariroastery.id/ (reference only).
5. **Public / user access only.** No admin backend yet — the user decides that
   later (WordPress-like). Use **dummy data** shaped like Sanubari's content.
6. A **sub-project** may be created as a reference to copy public data/pages.
7. Set up **ai-website-cloner-template** standalone (ask location, clone,
   remove `origin`, install deps, `npm run check`).
8. Produce an **implementation plan from start to end**, aligned with the user
   (grill/interview style) and documented in `docs/`.

## Project context

- Stack: Laravel 12, Inertia v3, React 19, TypeScript, Tailwind v4, Pest, SQLite.
- Local URL (Herd): http://sanubari.test
