# Repro: "Select all across pages" bulk actions ignore `admin.baseFilter`

Payload 3.92.1, SQLite.

- `posts` has `admin.baseFilter: () => ({ archived: { not_equals: true } })` and `pagination.defaultLimit: 5`.
- Seed: 6 visible posts + 4 archived posts. The list view shows "1-5 of 6".

## Run

```sh
pnpm install
pnpm exec playwright install chromium
pnpm payload run src/seed.ts
pnpm test:e2e
```

The test checks all rows, clicks "Select all 6" (across pages), deletes, and counts archived posts.

- Expected: 4 archived posts remain.
- Actual: 0. The UI sends `DELETE /api/posts?limit=0&where[id][not_equals]=`, without the base filter.

Manual: `pnpm dev`, log in as `dev@example.com` / `test`, open Posts, select all across pages, Delete.
