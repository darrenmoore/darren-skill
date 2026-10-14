# Acting on live data, speaking managed copy: mediate writes, version words.

**Principle:** When the agent **writes business records**, every write goes through the owning
service's API (never raw SQL), touches only a **whitelisted set of fields**, and is **idempotent under
replay**. When the agent **speaks from approved copy**, that copy lives in a **versioned, reviewed
store**, and every sent message records which version it came from.

**Why it matters:** An LLM agent is a retry machine: checkpoints resume, webhooks redeliver, steps
re-run. A write that isn't replay-safe will eventually double-fire, and a duplicated business change
corrupts the thing humans work from. On the copy side, user-facing words are a product surface that
non-engineers need to edit, review and roll back. Copy baked into prompts or locale files makes every
wording change a deploy and makes "who approved this sentence?" unanswerable.

## Do: writes
- **API, not SQL.** The owning service enforces history, transitions and side effects; a direct DB
  write from an agent step bypasses all three.
- **Whitelist the fields** the agent may patch. The agent never owns the whole record.
- **Derive an idempotency key** (thread id + step + entity id + content hash) for non-idempotent writes.
  For scalar patches, store the applied patch hash in durable state and skip when unchanged.
- **Fail into state, not into silence.** A failed write lands in an error payload the reply path
  surfaces; the turn still answers the user.
- Gate irreversible actions behind human approval: prepare → approve → execute once → record.
- **Ops notifications are side effects too.** Post "quote sent" *after* the reply is composed and
  checked, not from the step that planned it. Otherwise a reply that floors to a handoff leaves the
  team looking at a quote the user never received.

## Do: copy
- **Store user-facing copy in a versioned store outside the binary**: a stable key per item, a version
  per change, rollback, a named owner. Read the current version through a short-TTL cache that keeps
  the last good copy, so edits go live in minutes and an outage never silences the bot. Reject
  half-written content before it's stored.
- **Seed, adapt, fall back.** The approved text is the model's example and, where appropriate, the
  fallback when a draft fails grounding ([03](03-grounding-and-fallbacks.md)).
- **Record provenance**: key and version on every message derived from managed copy.
- **Validate the key space at startup.** A dangling key fails at boot, not mid-conversation at 2am.
- Prove **answer reachability**, not template presence: from a realistic state, assert the system
  selects the right key, renders its variables, passes grounding, records provenance and sends it.
- **Derive voice rules from the real human operator's messages, measured.** Count before you
  prescribe: median reply length, greeting habits, how often they apologise. Keep voice rules in their
  own prompt file so voice changes don't collide with persona edits, and measure drift with a rubric
  judge rather than by rereading transcripts.

## Don't
- Let an agent step write a table it doesn't own, or duplicate state the checkpointer already owns.
- Assume "it's just a patch" is safe under resume. Prove it with a crash-replay test.
- Put editable copy in prompts, code or locale files once non-engineers need to own it. Prompts hold
  *instructions*; the store holds *words*.
- Serve unvalidated copy because the store was down. The fallback is the last good copy.
- Bake time-relative values into stored copy; use variables resolved at answer time.
- Call an approved row "integrated". Approval proves governance; only an end-to-end reachability test
  proves the flow can use it at the right stage.

## Why it compounds
Keeping knowledge outside the code meant one agent's rebuild could delete almost every line of reply
prose from the codebase while the ops team kept full editorial control with no deploys. Later the
store itself moved without touching reply code. An agent whose knowledge lives in code resists both.

**Smell test:** *"If this exact turn re-ran now (crash, retry, redelivery), what would be written twice?
And if someone asks who approved the sentence the bot just sent, is there an answer other than git
blame on a JSON file?"*
