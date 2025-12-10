/**
 * Popout Window Manager
 *
 * Creates popout windows and provides container elements for React portals.
 * The actual React rendering is done via createPortal in the component layer.
 */

import type { GroupId } from '../contracts/ComponentData';

// Track active popout windows
interface PopoutWindowInfo {
  window: Window;
  container: HTMLElement;
  onClose: () => void;
}

const activePopouts = new Map<GroupId, PopoutWindowInfo>();

/**
 * Check if a group has an active popout window
 */
export function hasActivePopout(groupId: GroupId): boolean {
  const info = activePopouts.get(groupId);
  return info != null && !info.window.closed;
}

/**
 * Get the container element for a popout (for React portal)
 */
export function getPopoutContainer(groupId: GroupId): HTMLElement | null {
  const info = activePopouts.get(groupId);
  if (info && !info.window.closed) {
    return info.container;
  }
  return null;
}

/**
 * Copy stylesheets from parent window to popout window
 */
function copyStyles(sourceDoc: Document, targetDoc: Document): void {
  // Copy all stylesheets
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    try {
      if (styleSheet.cssRules) {
        // Create a new style element
        const newStyle = targetDoc.createElement('style');
        Array.from(styleSheet.cssRules).forEach((rule) => {
          newStyle.appendChild(targetDoc.createTextNode(rule.cssText));
        });
        targetDoc.head.appendChild(newStyle);
      } else if (styleSheet.href) {
        // External stylesheet - create a link
        const newLink = targetDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = styleSheet.href;
        targetDoc.head.appendChild(newLink);
      }
    } catch (e) {
      // Cross-origin stylesheets may throw
      if (styleSheet.href) {
        const newLink = targetDoc.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = styleSheet.href;
        targetDoc.head.appendChild(newLink);
      }
    }
  });

  // Copy inline styles from head
  Array.from(sourceDoc.head.querySelectorAll('style')).forEach((style) => {
    const newStyle = targetDoc.createElement('style');
    newStyle.textContent = style.textContent;
    targetDoc.head.appendChild(newStyle);
  });
}

/**
 * Open a popout window for a group
 * Returns the container element for React portal, or null if blocked
 */
export function openPopout(
  groupId: GroupId,
  title: string,
  onClose: () => void
): HTMLElement | null {
  // Close existing popout for this group if any
  closePopout(groupId);

  // Calculate window size and position - place on right edge of screen, not overlapping main window
  const width = 600;
  const height = 700;

  // Get available screen space (availLeft/availTop are non-standard but widely supported)
  const screen = window.screen as Screen & { availLeft?: number; availTop?: number };
  const screenRight = screen.availWidth + (screen.availLeft ?? 0);
  const screenTop = screen.availTop ?? 0;

  // Position at right edge of screen
  const left = screenRight - width - 20;
  const top = screenTop + 50;

  // Open the window
  const popoutWindow = window.open(
    '',
    `popout-${groupId}`,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (!popoutWindow) {
    console.warn('Popout blocked by browser');
    return null;
  }

  // Set up the document
  // Use 67% zoom as baseline - popout windows render larger than main window for unknown reasons
  const doc = popoutWindow.document;
  doc.open();
  doc.write(`
<!DOCTYPE html>
<html class="${document.documentElement.classList.contains('dark') ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    html { font-size: 11px; }
  </style>
</head>
<body class="bg-gray-100 dark:bg-slate-800 p-2 overflow-y-auto" style="min-height: 100vh;">
  <div id="popout-root"></div>
</body>
</html>
  `);
  doc.close();

  // Copy styles from parent window
  copyStyles(document, doc);

  // Get the container for React portal
  const container = doc.getElementById('popout-root');
  if (!container) {
    popoutWindow.close();
    return null;
  }

  // Track the window
  const info: PopoutWindowInfo = {
    window: popoutWindow,
    container,
    onClose,
  };
  activePopouts.set(groupId, info);

  // Handle window close
  popoutWindow.addEventListener('beforeunload', () => {
    activePopouts.delete(groupId);
    // Use setTimeout to avoid calling onClose during unload
    setTimeout(onClose, 0);
  });

  // Try to keep focus on main window (browsers may not honor this)
  popoutWindow.blur();
  window.focus();

  // Also try after a short delay since window creation is async
  setTimeout(() => {
    window.focus();
  }, 100);

  return container;
}

/**
 * Close a popout window
 */
export function closePopout(groupId: GroupId): void {
  const info = activePopouts.get(groupId);
  if (info && !info.window.closed) {
    info.window.close();
  }
  activePopouts.delete(groupId);
}

/**
 * Close all popout windows
 */
export function closeAllPopouts(): void {
  for (const [groupId, info] of activePopouts.entries()) {
    if (!info.window.closed) {
      info.window.close();
    }
    activePopouts.delete(groupId);
  }
}

/**
 * Focus a popout window (bring to front)
 */
export function focusPopout(groupId: GroupId): void {
  const info = activePopouts.get(groupId);
  if (info && !info.window.closed) {
    info.window.focus();
  }
}
