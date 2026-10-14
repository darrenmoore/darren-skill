# A good prompt is a state-design problem. Promote facts, bound the window.

**Principle:** The prompt the model sees each turn is built from **structured, typed state**, not from
an ever-growing transcript. Facts are extracted once, validated and **promoted** into durable records;
the raw chat is working material, not memory. Keep two records with clear ownership: the
**conversation record** (what the agent knows, where the dialogue stands) and the **business record**
(what the organisation acts on), and re-read the business record at use time.

**Why it matters:** An agent that re-reads 60 raw messages every turn is slow, expensive and *less*
accurate: the model re-interprets old text and can re-open facts it already settled. Checkpointed state
is serialised on every step, so a bloated state object becomes the latency bottleneck too. Typed state
is also what makes the agent auditable: "delivery: Tuesday" in a field can be shown to a human, patched
by a human and quoted by the grounding check; the same fact buried in turn 14 can't.

## Do
- Keep a **typed durable core** (a schema-validated object) as the conversation record: collected
  facts, stage, counters, decision snapshots. Render the prompt from it plus a **bounded** window of
  recent turns.
- **Bound everything that accumulates** (recent turns, message ids, history maps) with an explicit cap.
- **Promote validated facts** into the business record through its API
  ([09](09-side-effects-and-copy.md)), with provenance (user-stated vs confirmed).
- **Re-read shared records at use time.** A human can edit the record between two turns; act on what it
  says now, not on a copy from three turns ago.
- **Freeze what justifies a decision; recompute what is about now** ([03](03-grounding-and-fallbacks.md)).
- Plan **schema evolution**: checkpointed state outlives deploys. New fields get defaults; never rename
  or repurpose a live key without a migration for in-flight conversations.
- **Removing a field needs a migration too.** With a strict schema and a loader that resets on a
  validation error, an old checkpoint carrying the dropped key fails to parse and the conversation
  silently starts over. Bump the schema version and add a step that drops the key.
- Keep checkpointed state **lean**: keys, ids and validated values, not raw model responses, rendered
  prompts or anything re-derivable.
- Keep **one authoritative semantic reading per turn**. Derived fields must preserve its distinctions
  and trace back to it.
- Test each validation, repair and projection function as a contract: valid typed input must not be
  broadened, dropped or contradicted.

## Don't
- Build prompts from the full transcript "to be safe". Selection is the point.
- Keep two writable homes for one fact.
- Let turn-local values (this turn's classification, this turn's draft) persist across turns. Clear
  them at turn start.
- Put transient plumbing (config, clients, request context) into checkpointed state.
- Create a second writable interpretation of the same turn (a typed objection kind plus a separately
  guessed generic flag). Competing meanings drift and precedence code hides the conflict.

## Example
A conversation agent with a typed record (facts, stage, last 10 turns, bounded id window) plus the
business record it works on. Confirmed facts go onto the business record through a whitelisted API
patch; the human team works from the same record; delivery steps read it at delivery time, so a human
edit between turns is never overwritten. The model never sees the raw transcript, which is why a
40-message conversation costs the same to reason over as a 12-message one.

**Smell test:** *"If I printed this turn's prompt, would a human recognise it as a briefing (current
facts, current stage, last few exchanges) or as a chat log dump?"*
