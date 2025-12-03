# UI_REFACTOR.md - Component Refactoring Plan

## 7. FloatingBoxManager Issues

### Current Problems

**Hover/upgrade behavior broken**:
- RelationshipInfoBox uses fixed positioning which conflicts with FloatingBox wrapper [sg] not sure if still true
- Fix: Refactor RelationshipInfoBox to support both transitory and persistent modes

**Architecture improvements needed**:
- Fix transitory/persistent box upgrade; currently creates deletes rel info box
  and creates new detail box. should simply make rel info box persistent (draggable, etc.)

See [TASKS.md - Unified Detail Box System](TASKS.md#unified-detail-box-system---remaining-work) for detailed issue list. [sg] broken link

---

## 8. LayoutManager Enhancements

### Potential Improvements

**Responsive panel widths**:
- Currently fixed widths (MAX_PANEL_WIDTH = 450px, EMPTY_PANEL_WIDTH = 180px)
- Could be more responsive based on window size and content

**Panel collapse/expand animations**:
- Middle panel toggle could be smoother
- Consider CSS transitions for panel width changes

**Better gutter visualization**:
- Gutters are plain gray - could show hints about what they're for
- Consider adding visual cues when links would appear

---
## Open Questions

1. **Badge behavior:** Should edge badges show outgoing count, incoming count, or total?
    - [sg] should have multiple badges 
2. **Edge filtering:** Should LinkOverlay allow filtering by edge type (show only inheritance)?
    - [sg] no
3. **Self-referential edges:** How to visualize class with self-reference (e.g., `parent: Specimen`)?
    - [sg] done
4. **Edge labels:** Show on hover? Always visible? Configurable?
    - [sg] show on hover. also, tooltip needs improvement
