# Documentation Conventions

> **Purpose**: Define structure and organization for CLAUDE.md and PROGRESS.md to prevent numbering chaos and enable flexible task ordering

---

## File Purposes

### CLAUDE.md
**Forward-looking**: Documents tasks to be done, questions to resolve, and architectural decisions to make.

**Structure**:
1. Tasks from Conversation (new tasks given directly in chat)
2. Quick Items
3. Questions & Decisions Needed
4. Current Phase
5. Upcoming Work
6. Future Ideas (Unprioritized)
7. Open Architectural Questions
8. Implementation Notes & Lessons Learned

### PROGRESS.md
**Backward-looking**: Records completed work for reporting to managers, funders, and stakeholders.

**Structure**:
- Reverse chronological order (newest first)
- Date-stamped entries
- Completed phases with git commit references
- Completed quick items
- Resolved questions with decisions made

---

## CLAUDE.md Structure Details

### 1. Tasks from Conversation

**Purpose**: Capture tasks given directly in chat before implementing them

**Guidelines**:
- Add tasks here when user says **"[PLAN]"** prefix (e.g., "[PLAN] fix the color bug")
- Without [PLAN] prefix, implement immediately (existing behavior)
- Indicate priority relative to other work:
  - "Add to Quick Items" (do soon)
  - "Add to Current Phase" (do now as part of current work)
  - "Add to Upcoming Work" (do after current phase, specify position)
  - "Add to Questions" (needs clarification first)
- Delete item when moved to appropriate section or implemented
- Tag with type: 🐛 bug, ✨ feature, 📝 docs, ♻️ refactor, 🧪 test, 🔧 config

**Example**:
```markdown
## Tasks from Conversation

- 🐛 Fix color mismatch in class icons → Add to Quick Items
- ✨ Add export to CSV feature → Add to Upcoming Work (after "Collections Store Elements")
- 📝 Update README with new screenshots → Add to Quick Items
```

**User shortcut**: Use `[PLAN]` prefix to say "add this to CLAUDE.md instead of doing it now"

---

### 2. Quick Items

**Purpose**: Small immediate fixes that don't need full phases

**Guidelines**:
- Keep concise (1-2 lines per item)
- Delete when done (NOT moved to PROGRESS.md - quick items don't go there)
- Can mark subtasks as complete with ✅ (only whole phases go to PROGRESS.md)
- Tag with type: 🐛 bug, ✨ feature, 📝 docs, ♻️ refactor, 🧪 test, 🔧 config
- Optional importance markers (for stakeholder visibility):
  - 🔴 High importance - Major impact on project goals
  - 🟡 Medium importance - Useful but not critical
  - (no marker) - Low importance - Internal improvements

**Example**:
```markdown
## Quick Items

- 📝 Move doc files to docs directory
- 📝 Fix typo in README.md
- 🐛 Clicking class brings up wrong detail panel (blocks testing)
```

---

### 3. Questions & Decisions Needed

**Purpose**: Blockers requiring external input (manager, user research, architectural decisions)

**Guidelines**:
- Frame as questions with context
- Include who needs to answer
- Move to PROGRESS.md when resolved with decision

**Example**:
```markdown
## Questions & Decisions Needed

### Boss Question: Variable Treatment for Condition Class

**Context**: [background]

**Her explanation**: [quote]

**My question**: I still don't understand. Do you? Can you try to explain?
```

---

### 4. Current Phase

**Purpose**: Single active work stream, clearly marked

**Guidelines**:
- Only ONE current phase at a time
- Always at top of work sections for visibility
- Include status and concrete action items
- Can mark subtasks as complete with ✅ (only whole completed phase moves to PROGRESS.md)
- Move entire phase to PROGRESS.md when all work complete
- Tag with type: 🐛 bug, ✨ feature, 📝 docs, ♻️ refactor, 🧪 test
- Tag with importance (for PROGRESS.md stakeholder visibility):
  - 🔴 High importance - Major features, critical fixes, architectural milestones
  - 🟡 Medium importance - Nice enhancements, quality improvements
  - (no marker) - Low importance - Internal refactoring, minor tweaks

**Example**:
```markdown
## Current Phase: Fix DetailPanel Tests & Bug

**Status**: Tests created, need to update expectations

**What's failing**: [specific details]

**Action**: [concrete next steps]
```

---

### 5. Upcoming Work

**Purpose**: Prioritized list of work to be done after current phase

**Guidelines**:
- Listed in **intended implementation order** (top = next)
- NO phase numbers yet - just descriptions
- Reorder freely as priorities change
- Tag with type: 🐛 bug, ✨ feature, 📝 docs, ♻️ refactor, 🧪 test
- Tag with importance (helps stakeholders understand value when moved to PROGRESS.md):
  - 🔴 High importance - Major features, critical fixes, architectural milestones
  - 🟡 Medium importance - Nice enhancements, quality improvements
  - (no marker) - Low importance - Internal refactoring, minor tweaks
- When work starts, promote to "Current Phase"
- Use `<details>` tags for low-importance items to start collapsed

**Note**: Importance ≠ Implementation Order. Order in list determines sequence. Importance markers help stakeholders understand project value.

**Example**:
```markdown
## Upcoming Work

Listed in intended implementation order (top = next):

### 🔴 ✨ Give Right-Side Stacked Detail Panels Same Features as Floating Dialogs

**Goal**: Feature parity between modes (high importance for user experience)

**Missing features**:
- [list]

---

### ♻️ Move renderItems to Section.tsx

**Goal**: Remove type-specific rendering (low importance - internal refactoring)

**Status**:
- ✅ EnumCollection done
- ⏳ ClassCollection pending

---

<details>
<summary>🟡 🧪 Add Comprehensive Integration Tests (medium importance, expand to view)</summary>

**Goal**: End-to-end testing

**Scope**:
- [details collapsed by default]
</details>
```

**Key insight**:
- Order in list = implementation order
- Importance markers (🔴🟡) help stakeholders understand project value in PROGRESS.md
- You can have 🔴 high-importance work listed AFTER low-importance work if that's the right technical sequence
- Use `<details>` for low-importance items to keep doc scannable

---

### 6. Future Ideas (Unprioritized)

**Purpose**: Backlog of features with no commitment to sequence or implementation

**Guidelines**:
- No importance markers needed (not yet prioritized)
- No ordering required
- Can be aspirational
- Tag with type: 🐛 bug, ✨ feature, 📝 docs, ♻️ refactor, 🧪 test
- Move to "Upcoming Work" when prioritized (add importance marker then)
- Use `<details>` to collapse long sections

**Example**:
```markdown
## Future Ideas (Unprioritized)

<details>
<summary>✨ Search and Filter</summary>

- Search bar with full-text search
- Highlight results in tree
- Quick navigation to results
</details>

<details>
<summary>✨ Neighborhood Zoom</summary>

- Show k-hop neighborhood
- Breadcrumb trail
</details>
```

---

### 7. Open Architectural Questions

**Purpose**: Document decisions deferred or alternatives considered

**Guidelines**:
- Include "Status: Deferred" or "Status: Under consideration"
- Document current approach vs alternatives
- Record decision rationale
- Keep even after decided (helps future contributors understand why)

**Example**:
```markdown
## Open Architectural Questions

### Where Should Element Type Metadata Live?

**Status**: Deferred - keeping ElementRegistry.ts for now (working well)

**Current approach**: Separate registry file

**Alternative approach**: Static properties in classes

**Decision**: Keep current approach until there's a compelling reason to change
```

---

### 8. Implementation Notes & Lessons Learned

**Purpose**: Technical knowledge discovered during implementation

**Guidelines**:
- Never delete - these are permanent reference
- Include bug fix references
- Document "gotchas" and non-obvious solutions
- Cross-reference with code locations

**Example**:
```markdown
## Implementation Notes & Lessons Learned

### LinkML Metadata Structure

**Bug fix reference**: DetailView.tsx originally looked for `propDef.type` but LinkML uses `propDef.range`

[technical details]
```

---

## Tag System

Use consistent emoji tags across all sections for type classification:

- 🐛 **bug** - Fixes incorrect behavior
- ✨ **feature** - Adds new functionality
- 📝 **docs** - Documentation only
- ♻️ **refactor** - Code restructuring without behavior change
- 🧪 **test** - Test additions or modifications
- 🔧 **config** - Configuration, build system, dependencies

Importance markers (optional, for stakeholder visibility):
- 🔴 **High importance** - Major features, critical fixes, architectural milestones
- 🟡 **Medium importance** - Nice enhancements, quality improvements
- (no marker) **Low importance** - Internal refactoring, minor tweaks

**Purpose**: Help stakeholders scanning PROGRESS.md quickly identify significant accomplishments

**Examples**:
- `🐛 Fix color mismatch` - bug fix (no importance marker = low)
- `🔴 ✨ Add CSV export` - high-importance new feature
- `♻️ Split Element.tsx` - refactoring (no marker = low)
- `🟡 📝 Document API` - medium-importance docs

---

## PROGRESS.md Structure

### Format

```markdown
# PROGRESS.md - Completed Work Archive

> Entries in reverse chronological order (newest first)

---

## YYYY-MM-DD

### Quick Items Completed
- [what was done] (file:line)

### Phase X: [Name]
**Completed**: YYYY-MM-DD

**What was added**: [features]

**Technical details**: [implementation notes]

**Git commits**: [hashes]

---

## Earlier Dated Sections...
```

### Guidelines

1. **Date sections** in reverse chronological order (newest first)
2. **Only completed phases** go here (NOT quick items or subtasks)
3. **Full context** for each phase (what/why/how/technical details)
4. **Git commit references** for traceability
5. **Keep indefinitely** - this is your project history
6. **Use `<details>`** for long phases to keep scannable

---

## Compliance Checking

### Manual Checks

Before committing changes to CLAUDE.md:

1. ✅ Is there exactly ONE "Current Phase"?
2. ✅ Are "Upcoming Work" items in implementation order (not by importance)?
3. ✅ Do importance markers (🔴🟡) reflect stakeholder value, not urgency?
4. ✅ Are only completed PHASES moved to PROGRESS.md (not quick items or subtasks)?
5. ✅ Are "Quick Items" truly quick (1-2 lines)?
6. ✅ Do "Questions" have clear context and decision makers?
7. ✅ Are "Implementation Notes" never deleted?
8. ✅ Are items properly tagged (🐛✨📝♻️🧪🔧)?
9. ✅ Are low-importance items in `<details>` tags?
10. ✅ Is "Tasks from Conversation" section clear or empty?

### Future: Automated Checks

Consider adding:
- Pre-commit hook to verify structure
- Script to check for multiple "Current Phase" headers
- Linter for importance marker overuse

---

## Why These Conventions?

### Problem: Phase number chaos
- Adding work out-of-sequence breaks numbering
- Renumbering creates confusion in discussions/commits
- Numbers imply fixed order that doesn't match reality

### Solution: Order by position, not numbers
- "Upcoming Work" is naturally ordered (top = next)
- Add new work anywhere without renumbering
- Assign numbers only when work becomes "Current Phase"
- Numbers become historical markers in PROGRESS.md

### Problem: Stakeholders can't identify important work
- All completed work looks equally significant in PROGRESS.md
- Hard to distinguish major features from internal refactoring
- Stakeholders waste time reading about low-value changes

### Solution: Importance markers for stakeholder scanning
- Implementation order determined by list position in CLAUDE.md
- Importance markers (🔴🟡 or none) help stakeholders identify significant work in PROGRESS.md
- Can have high-importance work listed AFTER low-importance if that's the right technical sequence
- Example: "Add CSV export" (🔴 high importance) might be listed after "Refactor Element.tsx" (no marker = low) if refactoring must happen first

### Problem: Losing context
- Quick wins get done and forgotten
- Architectural decisions lose rationale over time
- Past contributors leave no explanation

### Solution: Separate concerns
- CLAUDE.md = what's next (only completed phases move out, subtasks can be marked ✅)
- PROGRESS.md = what happened (completed phases only, not quick items)
- Implementation Notes = why it works this way
- Never delete context, just reorganize

### Problem: Claude implements before documenting
- User gives task in conversation
- Claude immediately starts implementing
- Task never gets into CLAUDE.md for prioritization
- User loses ability to control implementation order

### Solution: [PLAN] prefix
- User types "[PLAN] fix the bug" to document before implementing
- Without [PLAN], Claude implements immediately (existing behavior)
- Tasks from conversation go to dedicated section with routing instructions
- User indicates where task should go (Quick Items, Current Phase, Upcoming Work, etc.)

---

## Examples of Violations

### ❌ Bad: Multiple current phases
```markdown
## Current Phase: Fix Tests
## Current Phase: Refactor App.tsx  <!-- NO! Only one current phase -->
```

### ❌ Bad: Phase numbers in upcoming work
```markdown
## Upcoming Work
### Phase 5: Move renderItems  <!-- NO! Don't number until current -->
### Phase 6: Split Element.tsx
```

### ❌ Bad: Completed work still in CLAUDE.md
```markdown
## Current Phase: Add Search
**Status**: ✅ Complete  <!-- NO! Move to PROGRESS.md -->
```

### ❌ Bad: Out-of-order upcoming work
```markdown
## Upcoming Work
### Performance Optimization  <!-- Listed first -->
### Fix Critical Bug 🔴      <!-- Listed second - should be first! -->
```

### ✅ Good: Clear structure
```markdown
## Current Phase: Fix DetailPanel Tests

## Upcoming Work
### 🔴 Fix Critical Bug  <!-- Critical work, listed first -->
### Refactor App.tsx     <!-- Normal work, listed second -->

## Future Ideas (Unprioritized)
### Performance Optimization  <!-- Not prioritized yet -->
```

---

## Changelog

- 2025-10-29: Initial documentation of conventions
