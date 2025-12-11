/**
 * Popout Window Manager
 *
 * Creates popout windows and provides container elements for React portals.
 * The actual React rendering is done via createPortal in the component layer.
 */

import type { GroupId } from '../contracts/ComponentData';
import { APP_CONFIG, getFloatSettings } from '../config/appConfig';

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
  groupSize: { width: number; height: number } | undefined,
  groupPosition: { x: number; y: number } | undefined,
  onClose: () => void
): HTMLElement | null {
  // Close existing popout for this group if any
  closePopout(groupId);

  // Use group's current size, or calculate from floats settings
  const { baseFontSize } = APP_CONFIG.popout;
  const settings = getFloatSettings(groupId);
  const defaultWidth = Math.floor(window.innerWidth * settings.defaultWidthPercent);
  const defaultHeight = Math.floor(window.innerHeight * settings.defaultHeightPercent);
  const width = groupSize?.width ?? defaultWidth;
  const height = groupSize?.height ?? defaultHeight;

  // Get available screen space (availLeft/availTop are non-standard but widely supported)
  const screen = window.screen as Screen & { availLeft?: number; availTop?: number };
  const screenRight = screen.availWidth + (screen.availLeft ?? 0);
  const screenTop = screen.availTop ?? 0;

  // Position at right edge of screen, using group's Y position if available
  const left = screenRight - width - 20;
  // Convert group's viewport Y position to screen Y position
  const top = groupPosition
    ? screenTop + groupPosition.y + (window.screenY - screenTop)
    : screenTop + 50;

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
    html { font-size: ${baseFontSize}; }
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
