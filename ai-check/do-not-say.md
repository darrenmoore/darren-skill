# Do not say

Phrases, openings and framings that make prose read as machine-written. Read this before writing or editing anything that goes out under your name. `check.mjs` reads the `Pattern:` lines in this file and flags every match.

These rules target the shape of a sentence, not only the literal words. The quoted examples show the shape. Avoid the shape even when the words differ.

Entries are grouped into families by shape. Most new tells belong to a family that is already here, so add new entries under the closest family, or extend an existing entry, instead of appending at the end.

A ban says what not to write. It doesn't say what to write instead. Avoiding a banned shape by clipping the sentence is the wrong fix: the replacement must still be a complete, clear sentence. When you have the better version, record the before/after pair in `before-after.md` as well.

Entry format:

```
- **The thing to avoid** ("example", "example").
  **Why:** one or two sentences.
  Pattern: `regex`
```

Patterns are JavaScript regular expressions, matched case-insensitively against each line after curly quotes are straightened. Keep them specific: a false positive costs a rewrite of a good sentence. Shapes with no fixed wording (rhythms, invented detail) get a prose entry and no pattern.

---

## Mechanical tells

*Single characters and words that show up far more in generated text than in human writing.*

- **No em dashes.** Use a comma, a full stop, brackets, or a new sentence.
  **Why:** the most reliable single tell, and a mechanical fix. If a sentence only works with an em dash, rewrite the sentence.
  Pattern: `—`

- **Marketing and assistant vocabulary** ("delve", "leverage", "seamless", "robust", "game-changer", "unlock", "supercharge", "elevate", "streamline", "deep dive", "plethora", "tapestry").
  **Why:** store-page language that says nothing concrete. Name the actual thing and what it does.
  Pattern: `\b(delve|delving|leverag(e|es|ed|ing)|seamless(ly)?|robust|game[- ]changer|unlock(s|ed|ing)?|supercharg(e|es|ed|ing)|elevat(e|es|ed|ing)|streamlin(e|es|ed|ing)|deep dive|plethora|tapestry)\b`

- **Outline scaffolding at the end** ("In conclusion", "To sum up", "In summary", "All in all").
  **Why:** the reader just read it. End on the last real thought.
  Pattern: `\b(in conclusion|to sum (it )?up|in summary|all in all)\b`

- **Stacked transitions** ("Furthermore", "Moreover", "Additionally", at the start of a sentence).
  **Why:** they pad the join between thoughts. Start the next thought.
  Pattern: `^\s*(furthermore|moreover|additionally),`

## Throat-clearing openings

*A sentence or fragment that only announces the next one. Delete it and start on the real sentence.*

- **A "So I [verb]." fragment that sets up the next sentence** ("So I asked. I typed something like this:").
  **Why:** the fragment is dead weight and opening on "So" is a tic. Start with the sentence that does the work: "Here's roughly what I asked:".

- **Claiming a section is what readers ask about most** ("This is the question I get most", "A lot of you have asked about X", "the bit you came here for").
  **Why:** audience flattery that delays the content.
  Pattern: `\b(the question i get (asked )?most|a lot of you have asked|the bit you came here for|the comparison people will ask for)\b`

- **Honesty announcements and fake relatability** ("Honestly,", "Let's be real", "Let's be honest", "I'll level with you", "Here's the thing", "Picture this:", "Imagine this:").
  **Why:** manufactures intimacy and stalls before the point. Start on the real first sentence.
  Pattern: `\b(let'?s be (real|honest)|i'?ll level with you|i'?ll be straight( with you| about why)?|here'?s the thing|picture this:|imagine this:)`
  Pattern: `^\s*honestly[,?]`

- **"Worth noting" throat-clearing** ("Worth noting", "It's worth mentioning", "Worth being clear about").
  **Why:** flags the next point as important instead of making it.
  Pattern: `\b(it'?s )?worth (noting|mentioning|saying|being clear about)\b`

- **Flattery and reflexive agreement** ("Great question", "You're absolutely right", "Happy to help").
  **Why:** empty warmth from an assistant performing enthusiasm. State the thing, and disagree when that's the honest read.
  Pattern: `\b(great question|you'?re absolutely right|that'?s a (great|fantastic) point|happy to help)\b`

## Signposting and rating your own material

*Telling the reader which part matters, how many points there are, or which answer is boring, instead of saying the thing.*

- **Announcing which bit is important** ("The part that matters is X", "The key thing here is", "Here's the important bit", "What's interesting is").
  **Why:** a meta sentence that adds a beat and says nothing. Lead with the point.
  Pattern: `\bthe (part|bit|one|thing) that (matters|counts|does the work)\b`
  Pattern: `\b(the (key|important) (thing|bit|part) (here )?is|here'?s the important bit|what'?s interesting is)\b`

- **Tagging a number as the one you'd point at** ("that's the number I'd point at", "the stat worth pointing at").
  **Why:** give the number, then say what follows from it.
  Pattern: `\bthe (number|stat|figure|part|bit) (i'?d (actually )?point (at|to)|worth pointing at)\b`

- **Counting your points before making them** ("Two things matter here:", "There are three takeaways:", "A few things stand out:").
  **Why:** listicle throat-clearing. Make the points.
  Pattern: `\b(two|three|four|a few) (things|takeaways|beats) (matter|stand out)( here)?\b`
  Pattern: `\bthere are (two|three|four) takeaways\b`

- **Inflating a lesson** ("Here's the real lesson", "the lesson in all this", "the trick was simple").
  **Why:** hypes the point before stating it. State it.
  Pattern: `\b(here'?s the (honest |real )?lesson|the (real|big) lesson (here|in all this)|the lesson in all this|the trick was simple)\b`

- **Calling one answer boring before the interesting one** ("That's the boring answer, so here are the interesting ones").
  **Why:** stages a reveal out of your own material. Give both answers.
  Pattern: `\bthe (boring|dull) answer\b`

- **Coy headers that tease** ("The thing nobody tells you", "What I know for certain", "Here's what I've learned", "The part that turns X into Y").
  **Why:** a header should state the claim, not make the reader read on to find it.
  Pattern: `\b(the thing nobody tells you|here'?s what i'?ve learned|the part that turns)\b`

## Staged reveals and twists

*Drama made out of rhythm: a setup, a full stop, then a payoff or negation. Say it as one plain sentence.*

- **The moment of realisation** ("It hit me when", "That's when it clicked", "The moment I realised").
  **Why:** a manufactured epiphany. State what happened and let the fact carry it.
  Pattern: `\b(it hit me when|that'?s when it clicked|the moment i reali[sz]ed)\b`

- **Two clipped contrasting fragments** ("Same data. Two completely different stories.").
  **Why:** drama from rhythm. Write one sentence: "The same data tells two opposite stories."
  Pattern: `\bsame \w+\. (two |a )?(completely |totally )?different\b`

- **The negation twist** ("The fix wasn't more servers.", "The problem isn't the code. It's the process.").
  **Why:** teases the answer by naming what it isn't. Name what it is.
  Pattern: `\bthe (fix|answer|problem|issue) (wasn'?t|isn'?t)\b`

- **Announced surprise** ("What surprised me was", "to my surprise", "the part I didn't expect").
  **Why:** narrates your reaction instead of stating the fact. Being surprised is fine; say the fact.
  Pattern: `\b(what surprised me (was|most)|to my surprise|the (part|thing) i didn'?t expect)\b`

- **Spotlight tags** ("that's the one that got me", "that's where it all falls apart", "that's the part everyone gets wrong").
  **Why:** a tag bolted on to manufacture a point. Make one clean claim.
  Pattern: `\bthat'?s (the one that (got me|mattered)|where it all falls apart|the part \w+ (keeps getting|gets) wrong)\b`

- **Two-part titles with a twist** ("I rebuilt our billing. The database was the whole trick.").
  **Why:** the full stop in the middle does dramatic work. A title is a label. If it needs two halves, join them with a colon and keep the second half descriptive.

- **"...and why I won't X yet" title tails** ("How I built X, and why I'm not shipping it yet").
  **Why:** a promise-to-explain that manufactures intrigue. State the claim.
  Pattern: `\band why i (won'?t|didn'?t|'?m not)\b`

## "Honest" and "plainly" as filler

*Labelling a statement as candid or blunt instead of just making it.*

- **"Stated plainly" tags** ("The problem, stated plainly", "to put it plainly").
  **Why:** advertises bluntness instead of being blunt.
  Pattern: `\b(stated plainly|plainly put|to put it plainly|let'?s be plain)\b`

- **"Honest" as a qualifier** ("the honest picture", "the honest truth", "worth being honest about").
  **Why:** labelling something honest doesn't make it so.
  Pattern: `\bthe honest (picture|truth|answer|version|reality|state)\b`
  Pattern: `\b(it'?s )?worth being honest about\b`

## Self-certifying tags

*A tag that congratulates, defends or reassures about the point instead of giving the reason or the evidence.*

- **"Earns its place" / "pulls its weight" / "doing real work"**.
  **Why:** praises the thing instead of explaining it.
  Pattern: `\b(earns its (place|keep)|pulls its weight|doing (real|the heavy) (work|lifting))\b`

- **"Boring on purpose"** ("it's deliberately boring", "unsexy but it works").
  **Why:** self-satisfied framing. List the concrete thing.
  Pattern: `\b(boring on purpose|deliberately (boring|dull|unglamorous))\b`

- **"And that's on purpose" / "by design" as a tag**.
  **Why:** certifies the choice instead of giving the reason. Give the reason.
  Pattern: `\b(and that'?s (on purpose|deliberate)|, by design\.)`

- **"X is illustrative, but the Y is real" reassurance** ("The numbers are made up, the pattern is real").
  **Why:** a neat contrast that reassures instead of informing. If it's illustrative, say so and stop.

- **Self-permission** ("and I'm fine with that", "I'm okay with that").
  **Why:** the writer granting themselves permission. State the choice and move on.
  Pattern: `\b(and )?i'?m (fine|okay|ok|happy) with that\b`

- **Aphoristic "X beats Y" closers** ("A short list beats a long meeting", "Measured beats remembered").
  **Why:** a manufactured maxim in place of the mechanism. State the mechanism.

- **"And I know it"** ("That's a big number and I know it").
  **Why:** performed self-awareness. Make the argument and give the real caveat.
  Pattern: `\band i know it\b`

- **Defensive authenticity disclaimers** ("typed by hand, not an automation", "a real person, not a bot").
  **Why:** protests instead of describing. Say how it actually works.

- **Telling the reader how to feel** ("sit with that", "that's the thing worth sitting with", "worth pausing on").
  **Why:** inflates the point. Make it and move on.
  Pattern: `\b(sit with that|worth sitting with|worth pausing on)\b`

## Writerly flourishes and shrugs

*A metaphor, an ominous adverb or an offhand shrug standing in for a plain statement or a real detail.*

- **"Quietly" as an ominous qualifier** ("services quietly disagree", "quietly breaks").
  **Why:** manufactures menace. Say what happens: they get out of sync.
  Pattern: `\bquietly (breaks|broke|disagree|took over|fails|failed|drifts)\b`

- **Side-eye metaphors for unease** ("the thing I keep looking at sideways").
  **Why:** a writerly stand-in for "I'm not sure about this".
  Pattern: `\blooking at (it |\w+ )?sideways\b`

- **Coy throwaways** ("I won't bore you with the details", "I'll spare you the details", "a small thing nobody asked for").
  **Why:** pretends to save the reader time while adding a beat. Give the detail or leave it out.
  Pattern: `\b(i won'?t bore you|i'?ll spare you)\b`
  Pattern: `\bnobody asked for\b`

- **Appeals to an unnamed crowd** ("the part nobody talks about", "what the demos don't show you", "nobody mentions this").
  **Why:** invents demos and people to make a point feel rarer than it is. State the thing.
  Pattern: `\b(nobody (talks about|mentions|shows you)|the (part|bit) nobody|what the demos don'?t)\b`

- **Pattern-gesturing closers** ("same story every time").
  **Why:** gestures at a pattern the examples already show. Stop, or state the pattern.
  Pattern: `\bsame (story|thing) every time\b`

- **Invented precise detail in a "They... They..." rhythm** ("They click the button you assumed nobody would click. They go to the page you haven't touched in three weeks.").
  **Why:** made-up colour plus staged anaphora. Say it plainly: "They use it in ways we never tested."

## How you describe yourself and the reader

*Self-labels, filler about habits, and framings of the reader that add nothing or talk down.*

- **Rating how often you use something** ("one of the tools I use most", "probably my most-used X").
  **Why:** an empty self-rating. Say what it does.
  Pattern: `\b(one of the ones i use most|my most[- ]used)\b`

- **Addressing the reader by their assumed lack of skill** ("If you're not technical", "For the non-coders reading", "Don't worry if this sounds complicated").
  **Why:** talks down. Explain it plainly for everyone.
  Pattern: `\b(if you'?re not technical|for the non-?(coders|developers|technical)|don'?t worry if this sounds)\b`

- **Describing the layout of the document you're writing about** ("Each section opens with...", "Under each one there's a question").
  **Why:** tells the reader nothing they need. Give them the content.
