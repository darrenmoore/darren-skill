# The channel is part of the agent. Declare the conversation policies.

**Principle:** A chat agent does not receive tidy one-message-per-turn input. Users send bursts,
webhooks deliver duplicates, humans take over mid-thread, and conversations stall. Each of these needs
a **declared, built policy**: burst folding, duplicate suppression, one turn at a time per thread,
bounded loops, handoff etiquette. An undeclared policy is a shipped bug waiting for traffic.

**Why it matters:** These failures never show up in scripted tests, which send one clean message and
wait. They show up in production as four contradictory replies to four message fragments, a
double-applied side effect on a webhook retry, the bot arguing with the human who just took over, or
the same question asked five times until the user leaves. Each is a *control* decision, code's job, and
cheap to build up front.

## Do
- **Fold bursts into one turn.** Collect rapid consecutive messages over a short window and give the
  model one combined input. It also reconciles self-corrections ("3 rooms, wait, 2") for free.
- **Serialise turns per thread.** Never run two turns concurrently on one conversation. Queue, reject
  or fold what arrives mid-turn: pick one and write it down.
- **Suppress exact duplicates** by message id, over a bounded window.
- **Bound every cross-turn loop with a counter and an exit**: clarification attempts, no-progress
  turns, frustration. The exit is a graceful handoff, not a longer loop. Record each threshold and why.
- **Escalation changes content, not just count.** A second clarification must *rephrase* with an
  example and offer the human option. Repeating the same words burns a strike on nothing.
- **Handoff etiquette:** once a human owns the thread, the bot sends at most one acknowledgement and
  then stays silent, deliberately, with an exit when the human hands back.
- Model handoff as an explicit lifecycle: **requested → acknowledged → active → returned**, with
  **cancelled** possible before active. Define who moves each transition and what the bot does in each.
- Test both directions: bot-to-human and human-to-bot. A request for review is not proof a human is
  active.
- Treat "user is unsure or skips a question" differently from "no progress": offer to skip non-blocking
  questions instead of marching towards handoff.

## Don't
- Reply per inbound fragment.
- Ship without a double-texting policy because "the checkpointer handles concurrency". It serialises
  *writes*, not *conversation logic*; counters and stage moves still interleave wrongly.
- Let the bot keep talking after a human takes over, or let a suppression gate become permanent
  silence. Both directions need a test.
- Retry a stalled conversation harder. Two failed clarifications mean the approach is wrong.
- Collapse requested, acknowledged and active into one boolean. Early suppression creates silence
  before a human is there; late suppression talks over an active human.

## Example
Both directions have bitten in production. A suppression gate killed every turn after handoff
regardless of what the user said ("I have more questions" got nothing). And duplicates were suppressed
by id, but distinct rapid messages each ran a full turn: real users send four in a row, and no scripted
test ever did.

**Smell test:** *"What happens on this thread if the user sends three messages in four seconds, the
webhook delivers one twice, and a human takes over halfway through?"*
