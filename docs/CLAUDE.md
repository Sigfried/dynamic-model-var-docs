# CLAUDE.md - Development Principles

> **⚠️ READ `~/.claude/CLAUDE.md` FIRST — it is not optional, and it is not
> duplicated here. ⚠️**
>
> The global file carries the rules that govern how a session is *run*: questions
> are not instructions, never destroy uncommitted work, when a sandbox refusal is
> real, how to write WORKLOG, and — most relevant to finishing work —
> **§Docs carry what a reader needs NOW** and **§Doc references are links**,
> which together are the standing rule for documentation and end-of-session
> cleanup. THIS file adds only what is specific to this repo. Where both speak,
> global wins unless a rule here says otherwise explicitly.
>
> If you did a cleanup pass and doc files end up longer, you almost
> certainly did it wrong.
>
> For architecture and data flow, see [ARCHITECTURE.md](ARCHITECTURE.md).
> For tasks, see [TASKS.md](TASKS.md) and [BACKLOG.md](BACKLOG.md).

---

## 🚨 CRITICAL ARCHITECTURAL PRINCIPLE 🚨

**SEPARATION OF MODEL AND VIEW CONCERNS**

Components must ONLY use abstract `Element` and `ElementCollection` classes. The view layer MUST NOT know about model-specific types. If a component needs type-specific behavior, add a polymorphic method to the Element base class instead.

**Before making ANY changes to components**: Ask "Does this component need to know about specific model types?" If yes, the architecture is wrong — put the logic in the Element classes instead.

---

## 🔒 ARCHITECTURAL ENFORCEMENT

**ESLint Rules Enforcing Separation of Concerns**

The project includes ESLint rules that prevent architectural violations in components:

**Rule 1: Ban DTO imports in components/**
- **Banned imports**: `ClassNode`, `EnumDefinition`, `SlotDefinition`, `SelectedElement` from [`types.ts`](../src/explore/graph-core/types.ts)
- **Scope**: `src/components/**/*.{ts,tsx}` only
- **Why**: Components must use Element classes, not raw DTOs
- **Error message**: "Components must not import DTOs. Use Element classes from models/Element instead."

**Rule 2: Ban concrete Element subclass imports in components/**
- **Banned imports**: `ClassElement`, `EnumElement`, `SlotElement`, `VariableElement` from `models/Element`
- **Scope**: `src/components/**/*.{ts,tsx}` only
- **Why**: Components must only use abstract `Element` class with polymorphic methods
- **Error message**: "Components must only import abstract Element class, not concrete subclasses."

**Pre-Change Checklist for Component Modifications**

Before modifying any component file:

1. ✅ Read the file header comment: "Must only import Element from models/, never concrete subclasses or DTOs"
2. ✅ Check imports: `grep -n "from.*types" src/components/YourComponent.tsx`
3. ✅ Check for banned imports: `grep -n "ClassElement\|EnumElement\|SlotElement\|VariableElement" src/components/YourComponent.tsx`
4. ✅ If you need type-specific behavior, add a polymorphic method to Element base class instead
5. ✅ Run ESLint after changes: `npm run lint`

**How to Add New Element Behavior**

❌ **WRONG** - Adding type check in component:
```typescript
// Component file
if (element.type === 'class') {
  // class-specific rendering
}
```

✅ **CORRECT** - Adding polymorphic method:
```typescript
// models/Element.tsx - Add to Element base class
abstract getDisplayInfo(): { title: string; color: string };

// Implement in each subclass
class ClassElement extends Element {
  getDisplayInfo() {
    return { title: this.name, color: 'blue' };
  }
}

// Component uses polymorphism
const info = element.getDisplayInfo();
```

---

## ⚠️ Additional Principles

### UI Import Rules

For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).

UI components (in `src/components/` and `src/hooks/`) must:
- ✅ Import from `services/DataService` (functions, types, interfaces)
- ✅ Import from other UI components (e.g., [`Section.tsx`](../src/components/Section.tsx))
- ✅ Import from `utils/` (helper functions)
- ❌ **NEVER** import from `models/` (not even types — DataService re-exports needed types)
- ❌ **NEVER** import DTOs from [`input_types.ts`](../src/input_types.ts)

### Error Handling: Fail Loudly in Development

**Do NOT silently skip unexpected situations.** During development, errors should be noisy so they get fixed.

**❌ WRONG** - Silent failure:
```typescript
const element = lookup.get(id);
if (!element) return null;  // Silently swallows the problem
```

**✅ CORRECT** - Throw or use error handler:
```typescript
const element = lookup.get(id);
if (!element) {
  throw new Error(`Element not found: ${id}`);  // Or use devError() once implemented
}
```

**Why this matters**: Silent failures hide bugs. An ID lookup that fails means something is wrong upstream - we need to know about it immediately, not discover it later through mysterious UI behavior.

**Future**: Implement `devError()` utility that throws in development but logs quietly in production.

---

## 📦 Related local library

**supergroup v2**: grouping + DAG library, the backbone of
`getOwnershipSubgraph` (see [ARCHITECTURE.md](ARCHITECTURE.md)). Published as
`supergroup@2.0.0` on npm and installed as a dependency. Source repo:
`~/github-repos/personal/supergroup` (spec in its
`docs/specs/2026-07-13-supergroup-v2-design.md`; README is outdated — trust
`dist/*.d.ts` and `src/`). Don't rebuild capabilities it already has.

---

## 🚧 GOTCHAS — read before running anything

- **Node needs no PATH export.** `node` is v24 here and both `npx vitest run`
  and `npm run build` are clean on it. An older note told every session to
  `export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"` first, against a
  system Node 16 that Vite 7 could not start on; that shell is gone. If a
  `node:fs/promises` / `constants` error ever comes back, it means `node` has
  resolved to something ancient again — check `node --version` before reaching
  for a version pin.
- **Never run `npm run dev`** — Siggie keeps the app running themselves.
- **Session start, if the work touches popover placement:** ask Siggie to run
  `make probe-browser` and leave it up. That is the whole setup — it is what
  lets Claude run `make e2e-probe`. Nothing else needs starting.
- **Verify with `npm run build`** (~2s). `npx tsc --noEmit` is too weak and has
  let breakage through; `npm run typecheck` is `tsc -b --noEmit`, which caught
  four real errors in one session that the bare form did not, and 46 hidden ones
  when it was introduced. TypeScript 5.9.3, strict mode. (In a sandbox `tsc -b`
  fails EPERM on `node_modules/.tmp`; the workaround is
  `npx tsc --noEmit -p tsconfig.app.json --tsBuildInfoFile "$TMPDIR/app.tsbuildinfo"`.)
- **The stale-union trap (global §Code style) has bitten this repo twice:**
  `'own-flip'` leaving `OwnershipVerdict`, then `MergeMode` (`'bend'`, not
  `'full'`). Grep for the old literal.
- **`console.log` is swallowed in vitest here.** To surface a value, assert it
  against a sentinel string and read the diff.
- **Lint baseline is 20 errors**, all pre-existing. Compare against the baseline
  rather than expecting zero.
- **jsdom does not do layout**, and does no CSS anchor positioning at all — see
  [TESTING.md](TESTING.md#placement-in-a-real-browser-playwright) before writing
  a test that measures positions. Popover placement needs the browser suite;
  `make e2e-probe` is the half Claude can run, given `make probe-browser`.
- **NEVER `git add -A`, `git add .`, or `git commit -a`.** Stage explicit paths.
  One such mistake put ~1128 lines of two sessions' implementation inside
  `b17db08`, a commit whose message claims it is docs-only.

### Documentation rules live in the global CLAUDE.md

**§Docs carry what a reader needs NOW** (live docs state what is true; text that
only refutes an earlier mistake belongs in [WORKLOG.md](../WORKLOG.md)) and
**§Doc references are links** (every file reference is a markdown link, with two
exceptions) are in `~/.claude/CLAUDE.md`. Read them there — they are not
repeated here.

What is repo-specific is the checker. Run it after editing docs:

```bash
python3 - <<'EOF'
import re, os, glob
def slugs(p):                                    # GitHub-style heading anchors
    out = set()
    for l in open(p, encoding='utf-8'):
        if l.startswith('#'):
            t = l.lstrip('#').strip().lower()
            t = re.sub(r'[^\w\s-]', '', t, flags=re.UNICODE)   # keeps _ and unicode
            out.add(t.strip().replace(' ', '-'))
    return out
bad = []
for f in ['README.md'] + glob.glob('docs/*.md'):
    d = os.path.dirname(f) or '.'
    txt = open(f, encoding='utf-8').read()
    for m in re.finditer(r'\[[^\]]*\]\(([^)#]+?)(#[^)]*)?\)', txt):
        t = m.group(1)
        if t.startswith(('http', 'mailto:')):
            continue
        if not os.path.exists(os.path.normpath(os.path.join(d, t))):
            bad.append(f'LINK   {f} -> {t}')
    for m in re.finditer(r'\]\(([^)#]*)#([^)]+)\)', txt):
        tgt = os.path.normpath(os.path.join(d, m.group(1))) if m.group(1) else f
        if not os.path.exists(tgt) or not tgt.endswith('.md'):
            continue
        if m.group(2).lower() not in slugs(tgt):
            bad.append(f'ANCHOR {f} -> {m.group(1)}#{m.group(2)}')
print('\n'.join(bad) if bad else 'ALL LINKS AND ANCHORS RESOLVE')
EOF
```

### Measure before diagnosing

**When a render looks wrong, write a probe test that prints the actual view
model before proposing a cause.** Four bugs in one session came from reasoning
about the render instead of measuring the data, and each was settled in ~30
seconds by a throwaway probe once someone bothered. Wrong guesses included
"context nodes shouldn't merge" (they should) and "DimensionalObservation
narrows observation_type" (it does not).

The pipeline is `getOwnershipSubgraph → buildViewModel → mergeSiblings`, and all
three are exported specifically so a probe can call them. See
[`src/test/mergedEdges.test.ts`](../src/test/mergedEdges.test.ts), which is that pattern made permanent.

---

## 📋 CURRENT TASK

See **[TASKS.md](TASKS.md)** for what is next, and
**[BACKLOG.md](BACKLOG.md)** for deferred work with its full write-up.
