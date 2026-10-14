# Change the least, and subtract before you add.

**Principle:** Diagnose first, then fix at the cheapest lever **inside the proven faulty layer**. The
usual order for comprehension problems is prompt/few-shots → context → model/temperature. Use the
smallest code correction when bisection proves CODE. Prefer removing a mechanism over adding one.

**Why it matters:** Agents over-build. Most agent failures are reading, wording or grounding problems
the model should own, not control-flow problems. Every line of code you add is another branch, flag
or encoding of intent that can drift out of step with the prompt. The leanest correct fix is usually
data (a few-shot, a context line) or a deletion. Reach for code only when the failure is about what
the bot *does*, not what it *understands*.

## Do
- Ask "can I remove a mechanism?" *before* "what should I add?" A deletion that collapses two
  encodings of one concept is the best fix available.
- Express new behaviour as **declarative data** (real-quote few-shots, intent examples) when the issue
  is comprehension.
- Keep code for **control and safety** decisions: sequencing, gating, "don't talk over the human".
- Let localisation override the generic cost order. A proven projection defect does not become a
  prompt task because prompt changes are usually cheaper.

## Don't
- Don't reflexively add a guard, a flag or a routing branch.
- Don't maintain two mechanisms for one concept. If "negotiation" is already a question type, it must
  not *also* be a risk flag. Pick one.
- Don't solve a comprehension problem in code. A regex or keyword guard for something the model should
  infer is a smell.
- Don't add a node or edge when a prompt line or example would do.
- Don't keep trying cheaper levers in the wrong layer after a fed-output probe proves where meaning
  changes.
- Don't widen what a required-field gate accepts without checking its history (`git log -S'<field>'`)
  and its consumers. If it has been widened before, or nothing downstream reads the value, change the
  gate instead: ask once and record the answer. One such gate was "fixed" three times before anyone
  noticed nothing read the field.

## Examples
- A misroute fix was a **deletion**: a redundant risk flag duplicated an existing question type, and
  the duplication was the bug. Removing it cost one state field, one precedence branch and one prompt
  line. No guard added.
- Handling seven new user intents was **declarative data**: real-quote few-shots and no new logic. The
  model read them at 100% across K runs.
- The one genuine code addition, "stay silent while a human owns the thread", was a *control* decision
  and earned a small deliberate change.

**Smell test:** *Am I adding code where a prompt line, a few-shot or a deletion would do?*
