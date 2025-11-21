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

## Next Steps
- Continue systematic review of remaining TASKS.md sections
- Then review other doc files
- Create consolidated active task list
- Archive historical content
- Identify and document current bugs
