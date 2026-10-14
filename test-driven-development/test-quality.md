# Test quality: tests that fail when the code is wrong

Read this when writing or reviewing any test. Every rule here exists to stop one failure: a test that mirrors what the code does today, so it stays green when the code is wrong.

Mocking rules (testing mock behaviour, test-only production methods, mocking without understanding, incomplete mocks) live in [testing-anti-patterns.md](testing-anti-patterns.md) and are not repeated here.

Examples use a generic JS/TS test runner (`it`, `expect`, `spyOn`). Translate to yours.

## The rules

### 1. Every test must be capable of failing

Before finishing a test, invert the logic in your head. If the code returned the wrong value, would this test catch it? If the assertion is too loose, it won't.

Don't stop at the thought experiment. Break the production line the test guards and watch it go red. At least one per batch; a loop over a list of lines (break, run, restore) takes minutes.

Three shapes that pass review and cannot fail:

- **A spy on a function the code no longer calls.** The mocked failure never happens, so the error path is never exercised. Assert the spy was actually called.
- **A fixture already in the safe state.** A redaction or guard test must start from input that carries the secret, and have a control case where the secret does show.
- **A helper that accepts the fallback.** A lookup that matches "the new shape or the old one" passes when the code silently falls back. Tightening it to one shape blinds the other half: "nothing was sent" checked through a new-shape-only helper passes when an old-shape message was sent. Negative assertions need their own lookup that sees both shapes.

Ids and keys tested only on fresh fixtures (ids 1 to 9) can hide parsing and overflow bugs. Use a many-digit id, and one past a 32-bit integer where your storage cares.

### 2. Arrange, Act, Assert (one Act per test)

Three separate sections. The Act is a single call.

```typescript
it('deducts stock when an order is placed', async () => {
  // Arrange
  seedProduct(productId, { stock: 10 });
  // Act
  await orderService.place(customerId, productId, 3);
  // Assert
  expect(getProduct(productId).stock).toBe(7);
});
```

If you need two Act sections, write two tests.

### 3. Test behaviour, not implementation

Ask "what should happen?", not "does line 47 execute?". Test through public APIs and service functions, not private fields or call order. If you refactor and the test breaks while behaviour is unchanged, the test was coupled to the implementation.

### 4. Names say what, in which scenario, with what result

```typescript
// Don't
it('test1', ...);
it('should work', ...);

// Do
it('rejects checkout when the cart is empty', ...);
it('returns QUOTA_EXCEEDED when the plan limit is reached', ...);
```

### 5. Cover happy path, error path and edges

- **Happy:** normal operation succeeds.
- **Error:** invalid input, missing prerequisite, permission denied, each returning its specific error code.
- **Edge:** zero, maximum, empty collections, exact boundary values.
- **Every shape that reaches the path.** When one code path is reached by several shapes (a single order, a bulk order, a subscription renewal, an admin override), test each shape. Each confirming round tends to find the next untested one.

### 6. Assert on state, not just return values

For mutations, check the data actually changed:

```typescript
// Don't: only the response
const result = await orderService.cancel(orderId);
expect(result.ok).toBe(true);

// Do: the side effect too
expect(getOrder(orderId).status).toBe('cancelled');
expect(getProduct(productId).stock).toBe(10);
```

**Side-effect emissions need a payload assertion.** Notifications, emails, webhooks, audit rows, events on a queue: if the emitter silently stops firing, or fires with the wrong arguments, the host function's return value is unchanged and a return-only test stays green. That is the silent-data-loss class. Spy the emitter or read the row it writes, and assert the payload (kind, ids, amounts).

Watch the seam: the emitter often fires from a different entry point than the one under test (the "order confirmed" email goes out from `checkout()`, not the inner `createOrder()`). Call the path that actually emits.

Read APIs (`listX`, `getXForReport`, `findActiveX`) need their own tests for their own branches. They don't inherit coverage from the write side.

### 7. Assert error codes, not error messages

Messages change. Codes are the contract.

```typescript
expect(error.code).toBe('INSUFFICIENT_FUNDS'); // not error.message
```

### 8. Use the most specific assertion

```typescript
// Don't
expect(result).toBeTruthy();
expect(items.length > 0).toBe(true);

// Do
expect(result.total).toBe(4200);
expect(items).toHaveLength(5);
```

Use `toBeTruthy()` / `toBeDefined()` only when that is genuinely all that matters.

### 9. No branching logic in tests

`if`, `switch`, `try/catch` or a ternary inside a test body means some assertions may never run. Write one test per branch.

### 10. Expect errors explicitly, never swallow them

```typescript
// Don't: passes whether it throws or not
try { await service.doSomething(); } catch (e) { /* ignore */ }

// Do
await expect(service.doSomething()).rejects.toThrow(/specific/);
```

### 11. Fresh data per test

Each test seeds its own data in `beforeEach`. Never depend on data another test created. `beforeAll` seeding shared mutable state is a smell.

### 12. Control all non-determinism

Pin randomness and time. Never depend on the wall clock or execution speed.

Traps that look pinned and aren't:

- **Your clock helper doesn't reach the database.** A column with a default like `DEFAULT now()` is stamped by the database with real time. Compare a pinned clock against it and the test passes the day it is written and fails the next. Set the row's timestamp yourself before comparing.
- **Check the helper's signature.** A time-pinning helper that takes a function, called with a date object, may type-check and then blow up somewhere unrelated, with a stack trace that never points at your test.
- **Don't read config or catalogue data at module scope.** If it only exists after per-test setup has run, a top-level read throws before any test executes. Read it inside `beforeEach` or the test.

### 13. Use realistic test data

`seedUser('alice@example.test', 'Alice')` and a balance of `1000`, not `seedUser('foo', 'bar')` and `999999999`.

### 14. Prefer a precise spy over replacing a whole module

A module-wide mock hoists, replaces everything and loses types. A spy on one function mocks exactly what you meant. Replace a whole module only to switch something off entirely (logging, analytics).

### 15. Check what your seed helpers really do

A helper that writes several fields from one argument (`seedStreak(12)` setting both `current = 12` and `longest = 12`) hides every bug in code that treats those fields differently, such as `max(previous, new)`. Check argument order against the helper's real signature too, especially when one helper breaks the pattern the others follow.

## Reject on sight

| Anti-pattern | What it looks like | Why it is dangerous |
|---|---|---|
| **Tautological test** | Asserts on the mock's return value, not the code's output | Always passes |
| **Testing the setup** | Seeds data, then asserts the seed worked | Proves the helpers, not the code |
| **Mocking the code under test** | Spies `service.method` to return `x`, then tests `service.method()` | Circular: you mocked the answer |
| **No assertions** | No `expect` in the body | Passes as long as it doesn't throw |
| **Copy-paste error** | Assertion copied from the success test into the failure test | Wrong assertion for the scenario |
| **The Liar** | `expect(true).toBeTruthy()`, or `toBeDefined()` on a mutation | Coverage without verification |
| **The Loudmouth** | `console.log` through the test | Noise hides real results |
| **Over-mocking** | More mock setup than assertions | Tests wiring, not behaviour |
| **The Sequencer** | Depends on array or key order the code doesn't promise | Use `toContain`, `objectContaining`, or sort first |
| **Silent fallback** | A fire-and-forget call with a `catch` that falls back | Ask whether any test would notice the fallback being taken every time |

## Review checklist

When reviewing tests (yours or anyone's), reject a test that fails any check:

| # | Check | Reject if |
|---|---|---|
| 1 | Calls production code | It only calls mocks or seed helpers |
| 2 | Asserts on code output | It asserts mock return values |
| 3 | Assertions are specific | `toBeTruthy` / `toBeDefined` on specific data |
| 4 | Would fail on a bug | Inverting the logic wouldn't change the result |
| 5 | No branching | `if` / `switch` / `try` / ternary in the body (rule 9) |
| 6 | Determinism | Time or randomness left loose (rule 12) |
| 7 | Errors expected | An error is swallowed (rule 10) |
| 8 | State checked | A mutation or emission checks only the return value (rule 6) |
| 9 | Name matches | The name says one thing, the assertions check another |
| 10 | One behaviour | Several unrelated assertions |

## Running tests

- Run only the tests for the area you touched while you work. Run `<your full test command>` before you call the change done.
- **A full-suite run measures the whole working tree,** including other sessions' or agents' uncommitted work. Before a full run, check `git status` for paths that aren't yours, and say what was in the tree when you report the result.
- **If your suites share a database, cache or fixture directory, find out whether two runs can overlap safely.** If they can't, run one at a time. A run that takes much longer than usual is contention until proven otherwise: look for orphaned test processes (by command line, not CPU time) before retrying, and after stopping a run, check the worker processes actually died.
