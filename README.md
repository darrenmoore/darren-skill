# Darren's skills

Skills, hooks and helper agents I use with coding agents, taken from my own projects and cleaned up so they make sense outside them.

Don't install them as they are. Have your agent read one, compare it with how your repo works, and adapt what fits. Paste this to review the whole collection:

```
Read the collection at https://github.com/darrenmoore/darren-skill. Don't install anything yet. Look at how this repo already works (our skills, hooks, conventions and the way we ship) and tell me which of these would actually help us, which overlap with what we already have, and which to skip. Wait for me to pick before you change anything.
```

## Planning and tracking work

- **[work](work/)** (skill): Work items as folders. The folder a task sits in is its status, so any agent can pick it up again.
- **[now-what](now-what/)** (skill): Ask "now what?" and get one short answer: where things stand and the next step.
- **[grill](grill/)** (skill): Questions you about a plan one decision at a time, with a recommended answer for each, until nothing is left vague. Adapted from grill-me by [Matt Pocock](https://github.com/mattpocock/skills).

## Agents that get better

- **[improve](improve/)** (skill, hook): Turns the session’s mistakes and corrections into rules for the next agent. No mistake, no new rule.

## Reviews and quality gates

- **[test-driven-development](test-driven-development/)** (skill, agent): Write the test, watch it fail, then write the code. Adds rules for tests that pass for the wrong reason, and a reviewer agent that asks whether each test would fail if the code were wrong. Based on superpowers by [Jesse Vincent](https://github.com/obra/superpowers).
- **[shakedown](shakedown/)** (skill, agent): Runs several review agents in parallel over finished work, each checking it against one of the repo’s standards.
- **[review-gate](review-gate/)** (hook, agent): Stops the agent from finishing until a reviewer has seen every file it changed in a given area.
- **[impact-check](impact-check/)** (skill): Before changing a business rule, lists everything else it touches so you can confirm the trade-off.

## Git with several agents

- **[commit](commit/)** (skill): Commits only this agent’s changes and leaves other agents’ and your own work alone.
- **[worktree-cleanup](worktree-cleanup/)** (skill, hook): Finds the git worktrees that are safe to delete. Never touches uncommitted or unpushed work.

## Building with LLMs

- **[agent-craft](agent-craft/)** (skill): Rules for prompts, context, model choice and evals, learned from running production chat agents.
- **[agent-fault](agent-fault/)** (skill): When an agent does the wrong thing, works out whether the code, the prompt or the model is at fault.

## Writing and marketing

- **[ai-check](ai-check/)** (skill, tool): Flags phrases that read as AI-written and keeps a banned list you add to as you go.
- **[tone](tone/)** (skill): Writes in your voice from a voice file, with notes on how to build that file.
- **[seo](seo/)** (skill): A phased SEO audit that ends in one prioritised report, or a single narrow check when that’s all you need. Adapted from the SEO audit method by [Chris Cooke](https://seo-audit-site.vercel.app/). Crawls with Squirrel Scan by [squirrelscan](https://github.com/squirrelscan/skills).

## Mentors

- **[cto-mentor](cto-mentor/)** (skill): A sparring partner for technical founders: argues the other side, turns gut calls into numbers, asks the questions you skipped.
- **[marketing-mentor](marketing-mentor/)** (skill): Blunt, data-first advice for indie game marketing: genre first, then channels, then copy. Built on the published advice of [Chris Zukowski](https://howtomarketagame.com).

Found one useful, or made it better? Open an issue.
