---
name: now-what
description: Gives one short answer on where things stand and the single next step. Use when the user asks "now what?", "what now?", "next?", "what do we do now?", "where are we?", or wants a concise next-step recommendation after coding, planning, debugging, research, review or a partial implementation.
---

# Now what

Give the user the next concrete move.

## Workflow

1. Rebuild the current state from the conversation and, when useful, quick read-only checks:
   `git status`, running servers, recent test or build results.
2. Find the critical path: what must happen next to make the work real, safer, shipped or
   unblocked.
3. Open with a one-line memory anchor: what just happened, what we are doing, and why it matters.
4. Give one recommended next action first.
5. Name blockers directly.
6. Keep it short unless the user asks for detail.

## Response shape

<one-line state reminder: what just happened, what we are doing, and why it matters>

- Next: <one concrete action>
- Why: <one sentence>
- Blocker: <only if there is one>
- Then: <optional follow-up>

The first line is a plain sentence, not a header.
Don't give a menu unless there really are several valid paths.
Don't re-summarise all the completed work.
Don't ask "should I proceed?" unless the next action is risky, destructive or needs a product
decision.
