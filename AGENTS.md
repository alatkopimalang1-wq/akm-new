# Agent Rules — Alat Kopi Malang

## Mandatory if asking push to github

1. When user asking to push into github, verify the remote backend using SSH credentials in `.server_ssh_access`, remote directory inside `domains/alatkopimalang.co.id/public_html`.
2. Push command to remote backend or origin: `git push origin main`.
3. Check the github head against local head and remote hostinger repository.
4. Verify production frontend at https://alatkopimalang.co.id and admin at https://alatkopimalang.co.id/admin.

## Stack

Laravel 13 · Filament 5 · Inertia v2/v3 · React 19 · TypeScript · Tailwind v4 · MariaDB.
Live URL: https://alatkopimalang.co.id
