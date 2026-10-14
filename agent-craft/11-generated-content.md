# Generated content people read every day: ledger it, measure it, read the fallback.

**Principle:** A feature that sends a prompt to a model and shows the result to users (a daily digest,
a summary, a newsletter, flavour text) is an operations problem as much as a prompt problem. Ledger
every attempt, measure what is in the prompt, check your own authored copy before blaming the model,
and read the fallback as a user would.

**Why it matters:** One audit of a daily generated digest found production running a month-old build,
60% of every prompt made of reference docs inlined whole, the largest of those docs telling the model
the opposite of what the feature needed, half the "AI repetition" users complained about coming from
*authored* copy, and every early reader getting the template and keeping it all day. None of it was
visible from the code.

## Before you build
1. **Ship the ledger with the feature.** One row per generation *attempt*: full prompt, model, tokens,
   cost, outcome, error, including skips. Without it the audit above would have been impossible; with
   it you can read the exact prompt production sent a month ago.
2. **Log something version-identifying.** A build or commit id in each ledger row. Without one, proving
   which code production is running is luck.
3. **Gate it, cap it, window it, and let it be switched off.** A kill switch, a generation window, one
   success per period, a monthly spend cap summed from the ledger. If the generator runs in a separate
   process or image, the gate and the ledger are your only levers on it.

## The prompt
4. **Measure the prompt before you tune it.** Split the assembled prompt into its blocks and report the
   byte budget of each. Keep that tool model-free so it runs in a test and against a prompt pulled
   from the ledger. In the audit, the data the content was supposed to be *about* was under a third of
   the prompt.
5. **A document written for humans is not a prompt.** Never inline a whole doc. Name the sections you
   need and make a missing section **fatal**, so a rename fails loudly. One inlined style guide, written
   for UI labels, told the model to address the reader directly; the feature's own rule said not to.
   The wrong instruction was the largest section in the prompt; the right one was one line.
6. **Never send internal or unreleased material to a public generative surface.** Allowlist sections.
   A whole doc sent "for context" can contain material marked internal, and it also acts as a standing
   nudge to write about that topic.
7. **Don't feed a model its own recent output verbatim.** Passing the last two outputs in full "for
   continuity" preserved the rut instead: one joke ran unbroken for three weeks. Pass **facts** (who,
   what, what is still open), not prose.

## Repetition
8. **Check the authored copy before blaming the model.** The exact line reported as "the AI keeps
   saying this" was hand-written template copy, repeated across several files. Grep your locale and
   template files before touching the prompt.
9. **One authored string per situation is a repeat.** If copy is selected by something the user
   triggers daily, the user reads the same paragraph every day with no model involved. Use a **pool**,
   rotated so a variant can't recur until the pool cycles. Seed by user as well as date when the
   surface is personal.
10. **Ban shapes, not strings, and tier them.** A stock phrase mutates across outputs and a literal
    blocklist catches the first two forms and misses the third. The frequency is the fault, rarely the
    phrase. Tier entries `forbidden` / `rationed` / `protected` with a reason each, and ban formulas,
    not subjects. Mine candidates from document-frequency n-grams; never let the miner write the list.

## Evaluating
11. **K≥3, or it is an anecdote.** Five prompt variants at K=3 on the production model cost under a
    dollar and settled a month of argument; within one variant, per-run scores varied by more than 2x.
12. **Measured beats plausible.** Trimming the reference bundle by 45% was the obvious fix for
    repetition and changed nothing. Injecting a do-not-reuse list took the worn-phrase count to zero
    and made the prompt cheaper. Never let an acceptance criterion assert a result nobody has run.
13. **"The user reads five drafts and says it's better" is not a gate.** A human read decides whether
    writing is good; it is not a measurement and can't be re-run before a release. Put a number in the
    gate, with a recorded baseline.

## Operating it
14. **A fallback that fires on schedule is not a fallback.** If generation runs at 03:00 for "today"
    but serving starts at 00:00, the template is the only path for three hours every day. Generate
    **ahead** of the window you serve.
15. **Never freeze provisional output.** "The page you re-open is the page you were shown" is a good
    rule until a reader opens before generation and freezes the template for good. Freeze only the
    final artefact, or keep the freeze rebuildable while the real one is missing.
16. **Degrade to something a user can actually read.** Open the fallback and read it as a user. Three
    bare slot-filled stat lines in a row read, accurately, as "a machine didn't even try".

## Safety
17. **A public generated surface fed by user activity is a privacy-leak vector.** If it can name a user
    next to an action, run your privacy rules per surface first. A correct redaction can also harden
    into a stock phrase ("an unknown user" in a third of outputs); vary how it is described.
18. **Scrub structured data the model may echo.** A sanitiser applied on the templated path was skipped
    by the generated path, and raw internal identifiers reached users. Sanitise on the way *out* of the
    model, not only on the way in. Assume anything structured you feed it will be echoed verbatim.

**Smell test:** *"Could I show, from the ledger alone, exactly what prompt production sent yesterday,
what it cost, and what the user saw if the model failed?"*
