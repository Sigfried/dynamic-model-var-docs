# Documentation Reorganization Decisions
**Date:** 2025-01-20
**Session:** Interactive doc/planning cleanup after demo

## Overall Strategy
- Radically simplify existing docs rather than adding more process documentation
- Delete/archive obsolete content aggressively
- Flatten nested hierarchies into simple lists
- Keep docs short enough to avoid TOCs if possible
- Use `docs/archive/tasks.md` for archiving TASKS.md content

## File Structure Decisions
- **Keep symlink approach:** Root-level symlinks point to canonical files in `docs/`
- **README.md:** Only actual file in root (for GitHub display)
- All other docs live in `docs/` with symlinks from root

---

## TASKS.md Section-by-Section Decisions

### Section 1 (Lines 3-64): "🚨 URGENT - Demo Fixes"
**Decision:** Delete/archive when finished with doc reorg
**Status:** Temporary context for this session

### Section 2 (Lines 66-111): "✅ Completed Quick Fixes"
**Decision:**
- Extract unfixed bugs to active bug list
- Archive fixed items to `docs/archive/tasks.md`
- Delete pseudocode (lines 96-105) - already incorporated into LinkOverlay

### Section 3 (Lines 113-134): "After Demo: Documentation & Structure Cleanup"
**Decision:** Use as rough guide but don't treat as settled - verify each file as we go

### Section 4 (Lines 137-161): "Table of Contents"
**Decision:**
- Currently broken, don't fix yet
- May become unnecessary if we simplify enough
- Revisit after reorganization complete

### Section 5 (Lines 163-182): "DetailContent.test.tsx Failures"
**Decision:**
- Keep as simple task
- Provide link to archived details if helpful
- Don't keep full detail in active tasks

### Section 6 (Lines 184-191): "Architecture & Refactoring Decisions"
**Decision:** Delete placeholder - content already archived

### Section 7 (Lines 193-243): "Different Variable Treatment for Condition and Drug Exposure"
**Decision:**
- Archive conversation (waiting for Anne's response)
- Keep link to archived version
- Keep resolution (line 236-242) as upcoming TODO - should be easy after model interface stable
- Note: Variables kept in hover/detail boxes, removed from panel interface

### Section 8 (Lines 245-268): "UI Component Refactoring 🎨 ACTIVE"
**Decision:**
- Work has progressed, some still relevant
- Prioritization probably doesn't match reality post-demo
- Combine/review with active bug list from Q2.2

### Section 9 (Lines 270-283): "Documentation Cleanup 📚 TODO"
**Decision:**
- This is what we're doing NOW
- Keep "CLAUDE.md - Add graph model patterns, SlotEdge architecture" as low-priority doc task
- Delete rest once done

### Section 10 (Lines 287-341): "Unified Detail Box System - Remaining Work"
**Decision:**
- Still relevant: #3, #4, #6, #7
- Uncertain: #5, #10
- Keep just the remaining tasks (lots of positioning issues exist)
- Remove historical detail

### Section 11 (Lines 345-387): "Future UI Improvements"
**Decision:**
- **LinkOverlay Refactor:** Currently active work (not sure where described)
- **Detail Panel Enhancements:** Coming up soon
  - Still not showing reachable_from for enums
  - Not showing inheritance
- **Abstract Tree Rendering:** Low priority, but related to grouping section items (fairly soon)
- Note: "See full task description in Future Work section" references don't exist - may be described elsewhere

### Section 12 (Lines 390-447): "Upcoming Features"
**Decision:**
- All three still upcoming: App Configuration File, Fix Dark Mode, User Help Documentation
- Use "upcoming work details file" with brief descriptions + links in TASKS.md
- **NEW ITEM:** URLs displayed as links - want soon, already set up for it (HIGH PRIORITY)

### Section 13 (Lines 449-815): "Future Work" - Detailed Breakdown
**Overall:** Way too long (366 lines). Archive most, extract priorities.

#### Items to Keep/Promote:

**High Priority:**
- **selfRefs (loop links):** May have done some on branch, high priority
- **External Link Integration:** High priority (same as URLs item above)

**Upcoming:**
- **Relationship Info Box - Bi-directional preview:** Hovering over element names in info box highlights them in tree panels
- **Overhaul Badge Display System:** Medium priority (same as Enhanced Element Metadata Display)

**Medium Priority:**
- **Search and Filter:**
  - Filtering: medium-low priority (grouping provides a lot already)
  - Search: important, medium priority
  - Filter toggles: needs discussion, put with other filtering tasks
- **Merge TESTING.md Files:** Both out of date, merge and update at some point
- **Terminology Consistency:**
  - Change "attribute" to "slot" in most/all places
  - Terminology configuration: not high priority, should go with app config file
- **Performance - Animation library:** Funkiness in interactions including link movement with scrolling. If this helps, medium priority
- **Performance - Viewport culling for links:** Better idea:
  - Don't show links when both endpoints off screen
  - When one endpoint visible, show beginning of link with interaction to bring other end into focus
  - Very nice but not high priority

**Low Priority Future:**
- **Relationship Info Box - Keyboard navigation**
- **Split Element.ts:** Hopefully won't be necessary after refactor (organizing code better already on list)
- **Custom Preset Management**
- **Neighborhood Zoom + Feature Parity with Official Docs (combined):**
  - Made more sense for node-link displays
  - Want ERDs and other stuff from linkml generated docs (like https://vladistan.github.io/linkml-qudt/datadict/#angleunit)

**Distant Future:**
- **Advanced Overview:** Cool future ideas
- **Performance - Virtualization:** Until we have bigger schemas (funding from beyond BDCHM)
- **Semantic Relationship Features:** Based on interesting but not usable early work. Some ideas worth considering. Add something about LLM support, maybe using MCP

**Delete:**
- **Relationship Info Box - "Explore relationship" action**
- **Graph-based Model Architecture:** Doing it now but nothing in this section relevant
- **GitHub Issue Management:** Ship has sailed, doing it without GitHub issue tracking

**End of Docs Refactor:**
- **Review DOC_CONVENTIONS.md:** Neither paid attention for long time. Look at end and see if anything worth keeping

### Section 14 (Lines 742-815): "UI Test Checklist Template"
**Decision:**
- Should have been useful, but never looked at it again
- Move to TESTING.md (doesn't belong in TASKS.md)

---

## TASKS.md Review Complete!

---

---

## Other Documentation Files Review

### Group A: Root-level unique files

#### ELEMENT_MERGE_ANALYSIS.md (Q15)
**Decision:** Pretty recent, will help with merging/reorganizing - KEEP

#### ELEMENTPREREFACTOR_RETIREMENT_PLAN.md (Q16)
**Decision:**
- Phases 2 and Phase 3.2 still relevant
- Put those somewhere sensible (nonredundant)
- Delete the rest

#### TWO_GRAPH_ANALYSIS.md (Q17)
**Decision:**
- Use "upcoming work details file" with brief descriptions + links in TASKS.md
- Not sure yet where it will end up in code refactoring order

#### LINKOVERLAY_REFACTOR_PLAN.md (Q18)
**Detailed section-by-section:**

**Design (from REFACTOR_PLAN Stage 5):**
- Redundant with description of grouping slots elsewhere
- More detail here though - merge them

**Add Class→Slot and Slot→Range Edges to Graph:**
- Think this is done
- Probably all code samples have been used
- Maybe worth checking if there's anything useful, but doubtful

**Your Proposal:**
- Not finished
- Think everything here has been put in other places

**Architecture LayoutManager Responsibilities:**
- Not sure if anything useful but check
- Lots of remaining work on LayoutManager

**Implementation Steps:**
- Phase 1: Think obsoleted by dom-based-link-overlay but check
- Phase 2: Ditto
- Phase 3: Ditto
- Phase 4: Combine with this task elsewhere, might help there

**Open Questions for You:**
- Questions 1-3: Obsolete
- Question 4: Open question but think is handled elsewhere

---

### Group B: Core docs/ files

#### docs/CLAUDE.md (Q19)
**Detailed section-by-section:**

**🚨 CRITICAL: NEVER DESTROY UNCOMMITTED WORK:**
- Make more succinct but MUST follow it

**🚨 CRITICAL ARCHITECTURAL PRINCIPLE:**
- I seldom pay attention but it would be nice

**Code elegance/DRY:**
- Add something about writing well-structured, DRY code?
- Only if it might actually change my behavior
- User wants: "code that can be appreciated by a good, clever programmer who loves elegance and concision"
- User notes: "you were trained on a lot more bad code than good"
- Make this more concise if keeping it
- Maybe put in ~/.claude/CLAUDE.md if I ever read that

**🔒 ARCHITECTURAL ENFORCEMENT:**
- Enforcement is in place, check and maybe expand
- Expand enforcement (in code), not this section
- Just enough to encourage continued enforcement of principles

**⚠️ Additional Principles:**
- Decent stuff, combine concisely with above

**Hierarchical Data:**
- Obsolete

**Structural Not Semantic Categorization:**
- Don't need this anymore

**Config-Based Abstraction Pattern:**
- Combine with App Configuration File elsewhere

**Element Identity: .name vs getId():**
- Baked into code now (at least in branch)
- Save whatever will help but keep concise

**🔧 TypeScript Build Configuration:**
- Make this part of workflow protocol
- User asks: "btw, i can find that long thing i wrote to launch this whole interactive thing. do you know where it is?"
  - Answer: TASKS.md Section 1 (lines 3-64 originally) - already decided to delete/archive when done

#### docs/REFACTOR_PLAN.md (Q20)
**Decision:**
- Obsolete
- Could archive but probably don't need it

#### docs/UI_REFACTOR.md (Q21)
**Decision:**
- Q21.1: Was the working doc until demo rush a couple days ago, then switched to urgent list at top of TASKS
- Q21.2: No duplication/conflict! TASKS.md Section 8 just has brief summary pointing to UI_REFACTOR.md for details
  - This is good pattern: short summary with link to detailed doc
  - Fits with "upcoming work details file" approach

#### docs/PROGRESS.md (Q22)
**Decision:**
- Don't drop it; archive it
- Won't continue to maintain
- If major milestones needed for reports, extract from archived stuff

---

### Group C: Supporting docs

#### docs/DOC_CONVENTIONS.md (Q23)
**Decision:** Skip for now, review at the very end of docs refactor

#### docs/COMPONENT_FLOW.md (Q24)
**Decision:** Obsolete

#### docs/GRAPHOLOGY_DESIGN.md (Q25)
**Decision:** Most if not all is decided, implemented, or obsolete

#### docs/TESTING.md (Q26)
**Decision:**
- Low priority
- If super easy and quick, can get it out of the way whenever
- Task: Merge with TESTING.root-snapshot-2025-11-03.md

#### docs/DATA_FLOW.md (Q27)
**Decision:**
- Haven't looked at in a long time
- Some probably obsolete, lots overlaps with plans elsewhere
- Needs careful review and merging anything important into other docs

---

### Group D: Other

#### scripts/README.md (Q28)
**Decision:** Don't need it (uv created it) - delete

#### archive/PHASE_6.4_PLAN.md (Q29)
**Decision:** Keep as-is (already archived)

---

## ✅ SYSTEMATIC REVIEW COMPLETE!

All documentation files reviewed. Ready to implement decisions.

---

## Next Steps

1. **Create implementation plan** - What order to tackle changes
2. **Start with quick wins** - Delete obsolete files, move things to archive
3. **Restructure active docs** - Apply decisions to TASKS.md, CLAUDE.md, etc.
4. **Create consolidated task lists** - Active bugs, upcoming work, future ideas
5. **Commit and clear context** - Save progress, prepare for fresh start on actual work
