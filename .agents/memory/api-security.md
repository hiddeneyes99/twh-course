---
name: API security gap
description: The Express API has no authentication middleware; all routes are open and x-member-id is client-trusted.
---

# API Security Gap

All API routes in `artifacts/api-server/src/` are publicly accessible with no authn/authz enforcement. The project uses Supabase Auth on the frontend but the backend does not validate JWTs or enforce member-level authorization.

**Why:** The auth layer was not yet implemented at the time of import. `replit.md` lists "Supabase Auth" as the intended auth provider.

**How to apply:** When working on any API route, do not add member-scoped mutations without first wiring up JWT validation middleware. The `x-member-id` header must NOT be trusted as an identity source — derive member identity server-side from a verified Supabase JWT. Follow-up task #2 covers implementing this.
