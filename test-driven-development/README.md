# test-driven-development

Write the test, watch it fail, then write the code, with extra rules for tests that pass for the wrong reason and a reviewer agent that asks whether each test would fail if the code were wrong.

Type: skill, agent

## Files
- `SKILL.md`: the red-green-refactor process, where expected behaviour comes from, and the step that proves each test can fail.
- `testing-anti-patterns.md`: the upstream mocking anti-patterns, unchanged.
- `test-quality.md`: rules for honest tests, a reject-on-sight table and a review checklist.
- `agents/test-reviewer.md`: a read-only reviewer subagent (Claude Code format) that hunts for tests which cannot fail.
- `LICENSE-UPSTREAM`: the MIT licence of the original.

## Adopt it
Paste this into your agent:

> Read test-driven-development at https://github.com/darrenmoore/darren-skill/tree/main/test-driven-development. Don't install it yet. Read every file in it first, then look at how this repo already works: our skills, hooks, conventions and the way we ship. Tell me what it does, whether it fits here, what it overlaps with, and what you would change so it suits our work. Wait for me to decide before you add or adapt anything.

Needs your test command in place of `<your test command>`. Examples are generic TypeScript.

## Credit
Based on the test-driven-development skill from [superpowers](https://github.com/obra/superpowers) by Jesse Vincent, MIT licence (see `LICENSE-UPSTREAM`). `testing-anti-patterns.md` and most of `SKILL.md` are the upstream text as of May 2026. Added here: the warning about tests that transcribe the code, where expected behaviour should come from, characterization tests for existing code, the break-it-and-watch-it-fail step, `test-quality.md` and the reviewer agent. Upstream has since reworked its anti-patterns file into `writing-good-tests.md`.
