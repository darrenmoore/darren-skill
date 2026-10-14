---
name: tone
description: |
  Write or edit prose in the user's own voice, driven by a voice file they keep. Use before
  drafting or editing anything they will send, publish or put their name on: updates to a
  boss or client, emails, blog posts, docs and README prose, ticket descriptions, commit
  bodies, chat messages. Also use when they say "/tone", "in my tone", "make this sound like
  me", "rewrite this in my voice", "does this sound like me", or push back that something
  reads as AI-written. Not for code, tests or config, and not for deciding what to say.
---

# Tone

Applies the user's voice, as written down in their voice file, to whatever is being drafted. The voice file holds the voice. This skill is only the routing.

**The rule this exists to enforce: the voice is constant, the register moves with the audience.** How the person sounds never changes. How long, how ordered, how warm and how dense the text is all change with who is reading. Getting that backwards produces text that is either pitched right but generic, or authentic but wrong for its reader.

## Setup

The user writes a voice file once and keeps it current. `voice-template.md` shows how to build one: sections, how to collect real examples, and how to record before/after pairs. Store it wherever they keep personal context (for example `docs/voice.md`) and set the path below.

- Voice file: `<path to your voice file>`
- Audience notes, if kept separately: `<path, or "in the voice file">`

If no voice file exists yet, say so, offer to start one from `voice-template.md`, and draft with the defaults in that template's "Constants" section until they have one.

## Do this

1. **Read the voice file.** All of it. It is short on purpose.
2. **Name the audience out loud** before drafting. If it isn't obvious from the request, ask. "Who's reading this?" is a one-line question that changes the whole draft.
3. **Read that audience's entry** in the voice file or audience notes. The voice file governs how it sounds; the audience entry governs what lands.
4. **Read the most recent before/after pairs.** They teach the voice faster than the rules do.
5. Draft it.
6. **Run the voice file's check-before-sending list** against the draft. It is a few mechanical checks and it catches most of what goes wrong. If you have a banned-phrase linter, run it too.

## When the audience contradicts the voice

It will. A reader who wants six bullets fights a voice that prefers connected paragraphs.

- **The constants never bend.** Whatever the voice file lists as constant (typically: no em dashes, no bolded sentences, no unbacked claims, no manufactured certainty, no marketing vocabulary, no tidy closing aphorism) holds for a two-line chat message and a two-thousand-word post alike.
- **The dials always bend.** Order, density, length and warmth belong to the reader.
- If a surface has its own guide (a blog style guide, a docs style guide), that guide wins on the dials for that surface, and the constants still hold.

## Things that keep going wrong

These are the failures that recur in AI drafts regardless of whose voice it is. Keep your own list in the voice file and add to it as they happen, with a date.

- **Em dashes.** The number one tell. It is a mechanical fix.
- **Bolding whole sentences.** Bold marks a phrase the reader must not miss. Two or three per page.
- **Claims with no numbers.** "The issues are small and fixable" asks the reader to take it on trust. Count them.
- **Certainty about the unfinished.** Claiming a property of issues not yet found. Say what has happened so far and leave the rest open.
- **Empty framing headers.** "Where we are", "What's happening now". Say the thing.
- **Hiding the mess.** Drafts present work as a clean run when it wasn't. One plain line about what actually cost the time makes everything else more believable.

## When the user corrects a draft

If they rewrite a sentence or reject one, add the before/after pair to the voice file's pairs section (newest first, with the date and surface). If the correction is a new rule rather than a one-off, add it to the right section of the voice file too. Confirm in one line what you added.
