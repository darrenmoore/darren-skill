# How to build your voice file

Your voice file describes how you write so that anything an agent drafts for you reads like you. It covers how the text should sound, not what it should say. Copy the skeleton at the bottom, then fill it in using the steps below. Aim for something you can read in five minutes. A long voice file gets skimmed.

## 1. Collect real samples first

Rules written from memory describe how you think you write. Samples show how you actually write.

- Gather 10 to 20 pieces you wrote yourself, without AI help, across your real surfaces: a few emails or updates to your boss or clients, a couple of chat threads, a blog post or long doc, some ticket or PR descriptions.
- Include at least one piece for each audience you write to regularly.
- Ask an agent to read them and list what it notices: sentence length, how you open, how you close, contractions, punctuation habits, what you never do, words you repeat, how you handle uncertainty, how warm you are with each audience. Then correct its list. The corrections are often the most useful part.
- Keep the samples in a folder next to the voice file. Don't paste them into it.

## 2. Separate constants from dials

Sort every rule into one of two piles.

- **Constants** hold for every audience and every surface. If a two-line chat message would break the rule, it isn't a constant.
- **Dials** move with the reader. Most people have four: order (conclusion first, or in the order things happened), density (bullets, or connected paragraphs), length, and warmth.

Mixing these up is the most common mistake. A rule like "use bullets" is a dial for one audience written down as a constant for all of them.

## 3. Write each audience down

One short entry per reader you write to often: their role, what they want first, how long they'll read, what they push back on, and how warm to be. Where an audience inverts a dial (one reader wants the exploration, another only wants the conclusion), say so plainly. If you keep notes on people elsewhere, link to them instead of repeating them.

## 4. Record before/after pairs as they happen

The fastest way the file improves. Every time you rewrite or reject a sentence an agent wrote, add the pair: what it wrote, what you accepted, and one line on why. After a month you'll have twenty pairs that teach your voice better than any rule. Keep the newest ten in the file and move older ones to an archive.

## 5. Keep a "keeps going wrong" list

When a draft fails in a way you've seen before, write it down with the date and a count if you have one ("14 em dashes in 40 lines"). Repeated failures belong in the check list.

## 6. Review it

Put a "last reviewed" date at the top. When you notice a draft sounds off and the file didn't prevent it, that's a gap: add the rule or the pair.

---

## Skeleton

Copy from here. Replace every `<...>`. Delete any section you have nothing real for yet, rather than filling it with guesses.

```markdown
# Voice

How I write. Not what to say, which changes with the audience, but how it should sound.

**Last reviewed:** <YYYY-MM-DD>
**Samples:** <path to the folder of real writing this was built from>

## The constants

These hold for every audience and surface.

Defaults most people keep (edit freely):

- **No em dashes.** Use a comma, a full stop, brackets, or a new sentence.
- **Contractions.** Write how you talk.
- **Bold the phrase, not the sentence.** Two or three per page.
- **Real numbers, or don't make the claim.** If the number isn't known, say the claim is unverified.
- **Say what's still open, in those words.** "I haven't decided", "I think", "not measured yet". Where something is settled, state it flat.
- **Never say something works unless it has been checked.** "A and B tested, C isn't" beats "should all be working now".
- **Don't dress up failure.** If two days went in the bin, say so.
- **Don't generalise from one case into a theory.** Report what happened.
- **Make the narrow claim and stop.** No pre-emptive defence against every objection.
- **Question anything that sounds elegant.** Quotable closing lines should be rare.
- **Headers say things.** Sentence case, mostly plain. No scene-setting headers.
- **No two-part titles with a dramatic full stop.** A title is a label.
- **Banned vocabulary:** <your list, e.g. leverage, seamless, robust, unlock, delve>
- **End sections cleanly.** Don't summarise what the reader just read.

Mine:

- <rule>: <one line on why, from the samples>

## The dials

| Dial | Range |
|---|---|
| Order | <conclusion first> to <the order things happened> |
| Density | <bullets under a one-line summary> to <paragraphs of 3 to 5 sentences> |
| Length | <shortest you'd send> to <longest> |
| Warmth | <internal and terse> to <external and warm> |

Always name the audience before drafting.

## By audience

**<Audience, e.g. my manager>.** <What they want first. How long they'll read. Bullets or prose. What they always ask. How warm. Any dial this audience inverts.>

**<Audience, e.g. customers>.** <...>

**<Surface, e.g. public blog posts>.** <Order, paragraph style, which guide governs it, and which wins when it conflicts with an audience rule.>

**<Surface, e.g. tickets and commits>.** <...>

## Things that keep going wrong

- **<Failure>.** <What happened, when, how often.>

## Before and after

Newest first. Keep the newest ten here.

- **Before:** "<what the agent wrote>"
  **After:** "<what I accepted>"
  **Why:** <unclear, overclaimed, wrong voice, invented, compressed>
  *(<surface>, <YYYY-MM-DD>)*

## Check before sending

1. Search the draft for an em dash. Any hit is a rewrite.
2. Is every bold a phrase, and are there fewer than four?
3. Does every claim about quality, progress or risk have a number, or an explicit "not measured yet"?
4. Is anything stated as working that hasn't been checked?
5. Read the headers on their own. Do they say things, or set scenes?
6. Is there a tidy closing line nobody needs? Cut it.
7. Did you name the audience and set the dials to match?
```
