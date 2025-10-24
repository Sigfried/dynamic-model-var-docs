# temp.md - Immediate Next Steps

> **Quick reference for current session work**
> - **PROGRESS.md** - Completed work for reporting
> - **CLAUDE.md** - Architecture, philosophy, future work

---

## Current Priority: UI Polish & Usability

### 1. Hover Highlighting for Links (NEXT UP)
**Problem**: Hard to see which links belong to which element

**Solutions**:
- Hover over element → highlight all its links
- Optionally: scroll opposite panel to show link endpoints
- Display relationship info (property name, relationship type) when highlighting

**Files**: `src/components/LinkOverlay.tsx`, `src/components/ClassSection.tsx`, etc.

### 2. Slots vs Attributes Terminology
**Problem**: Confusing terminology, slots not visible in class detail

**Current issues**:
- Using term "Properties" instead of "Slots"
- Attributes are just inline slots (per LinkML)
- Regular (reusable) slots not shown in class detail dialog
- 7 reusable slots buried among hundreds of attributes in panel view

**Solutions**:
- Change "Properties" → "Slots" everywhere
- Add note: "Called 'attributes' in LinkML model"
- Show both reusable slots AND attributes in class detail dialog
- Indicate source: "Inline" vs "Slot: id" (with link to slot definition)
- Consider collapsible sections: "Inline Slots (20)" and "Reusable Slots (3)"

**Files**: `src/components/DetailPanel.tsx`, `src/types.ts`, various section components

### 3. Scroll Indicators in Detail Dialogs (LOW PRIORITY)
**Problem**: No indication of scrollable content or how much content exists

**Solutions**:
- Link section headers at top of dialog (jump to section)
- Fade effect at bottom when more content below
- Mini table of contents showing sections

**Files**: `src/components/DetailPanel.tsx`, `src/components/DetailDialog.tsx`

---

## Additional Issues to Address

### GitHub Issue Management
**Issue**: https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/issues/126
- This issue describes the overall vision for this project
- Make it more concise
- Add subissues for specific features (ASK FIRST before creating)
- Note: Colleagues watch the HM repo, not the dynamic-model-var-docs repo

### Data Completeness Report
**Issue**: Missing items from bdchm.yaml in our schema
- Review output of `src/test/data-integrity.test.ts`
- Check what prefixes, imports, types, etc. are missing
- Verify completeness of classes, enums, slots

**Run**: `npm test -- data-integrity --run`

### External Link Integration
**Feature**: Link prefixed IDs to external sites
- **OMOP:123** → https://athena.ohdsi.org/search-terms/terms/123
- **DUO:0000042** → http://purl.obolibrary.org/obo/DUO_0000042
- Report undefined prefixes (e.g., `obo:ncbitaxon` - error or misunderstanding?)
- Use prefix data from bdchm.yaml

### Feature Parity with Official Docs
**Reference**: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

Features to add:
1. **Types** - Import and display linkml:types
2. **Dynamic enums** - Show which enums are dynamic (from enum metadata)
3. **LinkML Source** - Collapsible "Details" section showing raw LinkML (see ConditionConceptEnum example)
   - Note better convention: `<summary>Details</summary>` BELOW the title, not inside
4. **Direct and Induced** - Show direct vs inherited slots (similar to attributes/slots handling)

**Eventually** (longer term):
- Partial ERDs (like at https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/Condition/)
- We have the data for this, could use similar approach to attributes/slots
