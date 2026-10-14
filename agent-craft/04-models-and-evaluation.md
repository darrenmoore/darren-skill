# Choose the model on evidence; evaluate because models aren't deterministic.

**Principle:** The model is nondeterministic, often with no seed, and reasoning effort or temperature
widen the spread. Pick the model *and* temperature by **measuring** across a corpus. Lock that corpus
as a regression. The cheapest model that passes wins.

**Why it matters:** "Use the bigger model" and "the cheaper one is fine" are both guesses, expensive in
two directions: a bigger model costs money on every turn forever, a smaller one silently loses users.
A model that answered correctly once may fail the same phrasing one time in three. Real failure modes
only surface at K runs across many phrasings.

## Do
- Run every intent **K times** (K≥3) and report per-intent accuracy, not an anecdote.
- **Sweep models** side by side whenever a result is in doubt or a cost change is proposed.
- Build and **lock an eval corpus**: real phrasings, novel phrasings, boundary cases (terse, hostile,
  ambiguous, mixed-language).
- Read the **confusion matrix**: which intent gets mistaken for which. That is the map of where the bot
  will give a confident *wrong* answer.
- Set **temperature deliberately**: low or zero for classifiers and routing; higher only where you want
  variety.
- **Re-run the corpus before shipping** any model or prompt change. Promote each newly found failing
  phrasing into it.
- Assert **eval/production parity** before an expensive run: same model resolver, prompt and its hash,
  content source, flow stage, environment and feature flags. Deliberate sweeps name their deviation.
- **Print the resolved model** at the start of every run. Check which env file the tool actually loads.
- Record a preflight for long runs: branch, data target, resolved models, content source, prompt hash,
  filters, timeout behaviour, child-process cleanup.
- After the final behaviour change, re-run the required corpus. If you skip a full rerun, document a
  proven blast radius and rerun every affected conversation.

## Don't
- Judge a model on one prompt, one run or one happy-path conversation.
- Assume a tier without a measured number behind it.
- Reach for a bigger model before checking the prompt and few-shots ([01](01-change-the-least.md)).
  Most "model" failures are prompt failures.
- Ship a prompt "improvement" unproven. A fix that helps one phrasing can regress five others.
- Let an eval exist without running. A live-eval suite that is deselected by default and has never
  produced a recorded number is a broken rule wearing a green checkmark. An eval earns its keep only
  with a cadence and a written ledger of results per run.
- Let a judge emit free-text labels when code matches on them. Anything a lookup or `==` consumes must
  be **schema-constrained to the exact vocabulary** (an enum or `Literal`). One tone eval scored 0 on
  every rubric line because the judge returned descriptive rule names the harness couldn't match.
- Let the eval test a different model than production resolves. One eval config pinned a cheaper model
  than production used; its first ledger presented that model's known weaknesses as six "production
  failures", a day of phantom fixes. On the shipped model the suite was stable. When an eval failure
  matches a known weakness of a model you rejected, check which model the eval is calling.
- Reuse a pre-change report after behaviour changed. Evidence has an identity (code, prompt, model,
  content); once that changes, the old report is history.

## Example
A 49-phrasing intent corpus, K runs per model. The mid-tier model read 100% of real intents. The
cheapest model looked fine in casual testing, then collapsed on the corpus: "yes, go ahead" fell to 33%
(misread as small talk, so the sale silently died) and a key extraction field to 72%. That decided the
model on evidence. The same runs exposed a flag firing in 30% of runs that any single call had hidden.

Also: say "zero known RED roots; quality score X still below threshold", not "release-ready", when
another required rubric is below its gate.

**Smell test:** *"What's my evidence this model and temperature are right, across how many runs and
how many phrasings?"*
