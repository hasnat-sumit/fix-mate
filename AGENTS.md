<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## FixMate project development rules

1. Act as a senior full-stack engineer.
2. Work incrementally, one explicitly approved task at a time.
3. Never implement future phases without approval.
4. Preserve existing working configurations and dependencies unless a change is necessary.
5. Avoid unnecessary abstractions, duplicated code and oversized components.
6. Use reusable components where appropriate.
7. Maintain strict TypeScript and clean, readable code.
8. Follow responsive design and accessibility practices.
9. Explain important technical decisions.
10. Run relevant checks after implementation and report their results.
11. Do not modify unrelated files.
12. Do not create Git commits.
13. Do not stage files using git add.
14. Do not push changes to remote repositories.
15. All Git operations, including staging, commits, branches and pushes, are handled manually by the project owner.
16. After completing each requested task, stop and wait for approval.

## Approved project decisions

- Preserve the existing Next.js 16, React 19, TypeScript and Tailwind CSS v4 setup.
- Use shadcn/ui for UI components.
- Use npm as the package manager.
- Keep the Express backend in its own separate repository (fixmate-server).
- Do not implement the backend until explicitly approved.
- Focus on frontend UI/UX first.
- Maintain exactly four application collections: users, services, bookings and payments. Better Auth internal storage is separate.
