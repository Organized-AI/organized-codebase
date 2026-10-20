## What changes

<!-- One or two sentences, in plain words. -->

## How it was checked

- [ ] `node scripts/check.mjs` and `npm test` pass
- [ ] The e2e suite passes against staging (or the change can't affect what users connect to)
- [ ] New D1 migrations are additive (the running production version still works after they run)
- [ ] No keys, tokens or real people's emails in the diff

## Deploy

Merging to `main` syncs staging and opens **Deploy &lt;sha&gt; to production**. Production changes only when that pull request is merged.
