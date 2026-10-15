# JEE Previous Year Questions (PYQ) — 2000–2026

This directory contains templates and an index to collect JEE (Main & Advanced) previous year questions from 2000 to 2026, organized by year and subject. It's intended to help JEE aspirants keep all PYQs and solutions in one place.

Repository: siddhant6451890/Todoapp

Folder structure (recommended):

- jee_pyq/
  - README.md               ← this file
  - index.md                ← year-by-year index (created here)
  - 2000/                   ← folder for year 2000
    - physics.pdf or physics.md
    - chemistry.pdf or chemistry.md
    - maths.pdf or maths.md
    - solutions.pdf or solutions.md
    - meta.json             ← optional metadata (source, exam type, tags)
  - 2001/
  - ...
  - 2026/

How to contribute

1. Create a folder for the year (e.g. `jee_pyq/2015/`) and add PDFs or Markdown files named `physics.pdf`, `chemistry.pdf`, `maths.pdf`, `solutions.pdf` (or `.md` if you prefer text).
2. Update `jee_pyq/index.md` to add links to the files you added (or open a PR and I can update the index).
3. Optionally add `meta.json` in the year folder with fields like `{ "year": 2015, "exam": "JEE Main", "source": "official", "notes": "" }`.

Naming conventions

- Use four-digit years (e.g. `2010`).
- Use lowercase subject names: `physics`, `chemistry`, `maths`, `solutions`.
- Prefer PDFs for official scanned papers; prefer `.md` for plain-text or converted content.

Suggested metadata example (jee_pyq/2015/meta.json)

{
  "year": 2015,
  "exam": "JEE Main",
  "source": "official",
  "subjects": ["physics","chemistry","maths"]
}

Automation ideas (future)

- Add a script to validate that every year folder has at least one subject file and optionally auto-generate a web index.
- Add a small web viewer (HTML/JS) to list years and open PDFs — could integrate with the app or a GitHub Pages site.

License & attribution

Add files only if you have rights to share them. If you upload scanned PDFs, include source attribution in `meta.json` or the file name (for example: `physics_official_jeemain_2015.pdf`).

---

Happy studying! If you want, I can also:
- Create empty year folders with placeholder README files for each year 2000–2026.
- Add a CONTRIBUTING.md with contribution guidelines.
- Generate an initial index with placeholders for each year (2000–2026).