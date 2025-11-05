#!/bin/bash

# Architecture Violation Checker
# Ensures view/model separation: UI components should not import Element types
# Run after every chunk of work: npm run check-arch

echo "🔍 Checking architectural violations..."
echo ""

violations_found=0

# Check 1: "element" references in UI components (but not in tests)
# Allow: HTML element, ...elements spread, getElementById, querySelector
# Block: element as variable/parameter name, element.something, getElement, etc.
echo "📋 Check 1: 'element' variable/parameter references in src/components/ and src/hooks/"
element_refs=$(rg "\\belement\\b" src/components/ src/hooks/ --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null | grep -v "HTML element" | grep -v "\.\.\.element" | grep -v "getElementById" | grep -v "querySelector" || true)

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

# Check 3: Direct Element class imports in components
echo "📋 Check 3: Element class imports in src/components/"
element_imports=$(rg "from ['\"].*models/Element['\"]" src/components/ --glob '*.tsx' --glob '*.ts' --glob '!*.test.*' --glob '!*.spec.*' 2>/dev/null || true)

if [ -n "$element_imports" ]; then
  echo "❌ VIOLATION: Found Element imports in components:"
  echo "$element_imports"
  echo ""
  echo "💡 TIP: Use DataService instead of importing Element classes"
  echo ""
  violations_found=$((violations_found + 1))
else
  echo "✅ PASS: No Element imports in components"
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
