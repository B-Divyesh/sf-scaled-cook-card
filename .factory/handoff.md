# Scaled Cook Card — independent verification 7 handoff

## Outcome

**FAIL.** Candidate `d1301126a38fb52a012db5c6ebba1e85c6fa7521` was checked locally and at <https://scaled-cook-card.sociobot.in> on 2026-09-01 UTC.

The free recipe workflow, accessibility baseline, privacy behavior, offline mode, responsive layout, production build, and live deployment identity all passed. Release acceptance remains blocked for two high-severity findings:

1. The required `@claim:free-card-limits` command failed once at its 30-second limit before passing on rerun. The contract treats any claim-test failure as release-blocking.
2. The live first screen advertises `$9 once for optional history`, but checkout is disabled and the documented product checkout route returns HTTP 404. A new visitor cannot purchase Kitchen Pass.

Full evidence and reproduction details are in [`.factory/verification-7.md`](verification-7.md).

## Verification summary

- `npm ci`: PASS; zero reported package vulnerabilities.
- `npm test`: PASS, 15/15.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `npm run test:e2e`: PASS, 55 passed and 5 expected checkout-disabled skips.
- Required claim commands: 16 passed first run; `free-card-limits` failed first run and passed on immediate rerun.
- Fresh live browser audit: 52/52 checks passed apart from the separately checked unavailable purchase path.
- Live bundle identity: PASS; JavaScript, CSS, and service-worker hashes match the candidate build.
- Mobile Lighthouse: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.3 s, CLS 0, total blocking time 180 ms.
- License verification request allowance: 30 successful requests in the observed minute window; request 31 returned 429 with `Retry-After: 3`.

## Required next steps

1. Make the `free-card-limits` claim check wait for the one-step cook dialog state before choosing its next action, then run every exact command in `.factory/claims.json` from a fresh installation with no failures.
2. Register and enable the `scaled-cook-card` Sociobot billing product, enable checkout in the release build, and confirm the live buy link redirects to hosted checkout. If purchase is intentionally unavailable, remove the live `$9 once` promotion until it can be completed.

No product code was changed during verification.
