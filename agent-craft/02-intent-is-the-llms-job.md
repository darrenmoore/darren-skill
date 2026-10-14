# Human language is the model's job. Never regex it.

**Principle:** The model reads intent. Regex, keyword lists and fuzzy string matching never decide
intent; at most they are deterministic backstops. Real-quote few-shots steer the model; they are not
runtime matchers.

**Why it matters:** Human language has typos, synonyms, mixed languages in one sentence, sarcasm and
endless phrasings. A keyword matcher fails on exactly the long tail you can't enumerate, and it fails
silently. You reached for a model to read *meaning*; a phrase list re-introduces the brittleness you
adopted the model to escape, then hides it behind code that looks finished. If you are growing a
keyword list to catch "one more case", you are rebuilding the broken thing.

## Do
- Classify and extract intent with the model, returning a structured result (label, confidence,
  evidence span).
- Give the prompt **real mined quotes** as few-shot examples. They teach by example; they are not a
  lookup table.
- Let the model own typos, synonyms, mixed languages and slang.
- When nothing matches confidently, return `unknown` and hand off ([03](03-grounding-and-fallbacks.md)).
  A clean "I don't know" beats a confident wrong branch.
- If a deterministic check must exist (a hard safety gate, a legally required block), put it *below*
  the model as a backstop and write down why the model alone wasn't trusted there.

## Don't
- Branch on `if "price" in text` or `re.match(...)` to decide what the user meant.
- Run string similarity on human language to pick an intent.
- Let a phrase list be the final decider. The moment a keyword overrides the model's reading, you've
  reverted to the brittle system.
- Grep incoming messages against the few-shot quotes.
- Add a `case` for a phrasing that slipped through. Add the example to the few-shots and re-eval.

## The violation that ships anyway
Knowing this rule is not the same as holding it under deadline. One agent shipped with a keyword scan
for "wants a human" acting as the **final decider**: matched messages went straight to handoff and the
model never read them, so "my partner will call you back about the keys" handed off on "call … back".
It crept in as "just a safety shortcut" and looked like caution. Audit for it explicitly. The fix: the
model owns the decision via structured output; the scan survives only as a hint, plus the path where
the model call itself failed and a degraded turn must still reach a human.

## An empty field is the model's answer, not a gap
When the model returns nothing for a classification field, it has said "no". A backstop that fires on
the empty field "in case the model missed it" overrides the model rather than backing it up. Two such
phrase lists, measured against about 6,000 real user messages, hit 21 times: none were real cases, and
two were real answers the lists would have misread. The model alone scored 35/35 at K=5 on the same
phrasings. The lists were deleted.

## The converse: wording is the model's job too
Reading human language is the model's job, and so is writing it. Gluing replies from frozen template
blocks scored far below one composer call given persona, approved knowledge, the relevant record and
typed instructions, gated by deterministic checks. The rule that made it safe:

- **One seam for user-visible output.** Exactly one step produces text the user reads. Every other
  step emits a **typed directive** (`deliver_quote {amount}`, `ask {fields}`, `handoff_notice
  {reason}`). WHAT to say is code's decision; HOW to say it is the model's. Multi-intent turns compose
  for free.
- Directives are the testable boundary. Tests assert directives and checks, never prose, so tests stop
  pinning wording and the model stays free to write well.

## How to prove it
Run K-run intent evals across models on the phrasings you care about, including typo'd and
mixed-language variants. If a backstop fires on cases the model already gets right, delete the
backstop.

**Smell test:** *"Am I matching strings to understand a human, instead of asking the model?"*
