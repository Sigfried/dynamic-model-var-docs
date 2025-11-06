#!/bin/bash

# Architecture Violation Checker
# Ensures view/model separation: UI components should not import Element types
# Run after every chunk of work: npm run check-arch

echo "🔍 Checking architectural violations..."
echo ""

violations_found=0

# Check 1: "element" references in UI components (case-insensitive, no word boundaries)
# Allow: DOM/React types (HTMLElement, SVGElement, React.ReactElement, etc.), getElementById, querySelector, ElementTypeId
# Allow: Model data structure names (elementLookup - used by data loading hook)
# Block: Everything else containing "element"
echo "📋 Check 1: 'element' references (case-insensitive) in src/components/ and src/hooks/"
element_refs=$(rg -i "element" src/components/ src/hooks/ --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null | grep -v "getElementById" | grep -v "querySelector" | grep -v "React\." | grep -v "HTML" | grep -v "SVG" | grep -v "ElementTypeId" | grep -v "elementLookup" || true)

if [ -n "$element_refs" ]; then
  echo "❌ VIOLATION: Found 'element' variable/parameter references in UI code:"
  echo "$element_refs"
  echo ""
  echo "💡 TIP: Use 'item' in UI layer, 'element' in model layer"
  echo ""
  violations_found=$((violations_found + 1))
else
  echo "✅ PASS: No element variable/parameter references in UI components"
  echo ""
fi

# Check 2: elementType references in UI code
echo "📋 Check 2: 'elementType' references in src/components/ and src/hooks/"
elementType_refs=$(rg "\\belementType\\b" src/components/ src/hooks/ --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null || true)

if [ -n "$elementType_refs" ]; then
  echo "❌ VIOLATION: Found 'elementType' references in UI code:"
  echo "$elementType_refs"
  echo ""
  echo "💡 TIP: Use 'itemType' in UI layer, 'elementType' in model layer"
  echo ""
  violations_found=$((violations_found + 1))
else
  echo "✅ PASS: No elementType references in UI components"
  echo ""
fi

# Check 3: Model layer imports in components (should not import from models/ at all)
echo "📋 Check 3: Model layer imports in src/components/ and src/App.tsx"
element_imports=$(rg "from ['\"].*models/" src/components/ src/App.tsx --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null || true)

if [ -n "$element_imports" ]; then
  echo "❌ VIOLATION: Found imports from models/ in UI code:"
  echo "$element_imports"
  echo ""
  echo "💡 TIP: UI should only import from DataService, never from models/ (not even types)"
  echo ""
  violations_found=$((violations_found + 1))
else
  echo "✅ PASS: No model layer imports in UI components or App.tsx"
  echo ""
fi

# Check 4: Concrete Element subclass references in components
echo "📋 Check 4: Concrete Element subclass references in src/components/"
subclass_refs=$(rg "\\b(ClassElement|EnumElement|SlotElement|VariableElement)\\b" src/components/ --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null || true)

if [ -n "$subclass_refs" ]; then
  echo "❌ VIOLATION: Found concrete Element subclass references in components:"
  echo "$subclass_refs"
  echo ""
  echo "💡 TIP: Use DataService instead of Element instances"
  echo ""
  violations_found=$((violations_found + 1))
else
  echo "✅ PASS: No concrete Element subclass references in components"
  echo ""
fi

# Check 5: DTO references in components (ClassNode, EnumDefinition, etc.)
echo "📋 Check 5: DTO references in src/components/"
dto_refs=$(rg "\\b(ClassNode|EnumDefinition|SlotDefinition|SelectedElement|ClassData|EnumData|SlotData)\\b" src/components/ --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null || true)

if [ -n "$dto_refs" ]; then
  echo "❌ VIOLATION: Found DTO references in components:"
  echo "$dto_refs"
  echo ""
  echo "💡 TIP: Use DataService to access data, not DTOs"
  echo ""
  violations_found=$((violations_found + 1))
else
  echo "✅ PASS: No DTO references in components"
  echo ""
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $violations_found -eq 0 ]; then
  echo "✅ ALL CHECKS PASSED - Architecture is clean!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo "❌ FOUND $violations_found VIOLATION(S)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📚 Architectural Principle:"
  echo "   - UI components should only use DataService"
  echo "   - Use 'item' terminology in UI ('element' in model)"
  echo "   - Pass itemId + dataService, not Element instances"
  echo ""
  exit 1
fi
