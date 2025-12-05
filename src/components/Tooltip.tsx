/**
 * Tooltip - Fixed-position tooltip that doesn't get clipped by overflow containers
 *
 * Uses a portal to render at the document root level, avoiding any parent overflow clipping.
 * Shows after a configurable delay (default 200ms, much faster than browser default ~500-1000ms).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { APP_CONFIG } from '../config/appConfig';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 4
        });
        setIsVisible(true);
      }
    }, APP_CONFIG.timing.tooltipDelay);
  }, []);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone children with ref and event handlers
  const trigger = (
    <span
      ref={triggerRef as React.RefObject<HTMLSpanElement>}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      style={{ display: 'contents' }}
    >
      {children}
    </span>
  );

  const tooltip = isVisible && createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%) translateY(-100%)',
        padding: '4px 8px',
        backgroundColor: 'rgb(51, 65, 85)',
        color: 'white',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      {content}
    </div>,
    document.body
  );

  return (
    <>
      {trigger}
      {tooltip}
    </>
  );
}

/**
 * Wrapper component for elements that need tooltips
 * Use this when you can't easily wrap the element with Tooltip
 */
interface WithTooltipProps {
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function WithTooltip({
  tooltip,
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: WithTooltipProps & React.HTMLAttributes<HTMLSpanElement>) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = useCallback(() => {
    if (!tooltip) return;
    timeoutRef.current = window.setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 4
        });
        setIsVisible(true);
      }
    }, APP_CONFIG.timing.tooltipDelay);
  }, [tooltip]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    showTooltip();
    onMouseEnter?.();
  }, [showTooltip, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
    onMouseLeave?.();
  }, [hideTooltip, onMouseLeave]);

  const tooltipElement = isVisible && tooltip && createPortal(
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%) translateY(-100%)',
        padding: '4px 8px',
        backgroundColor: 'rgb(51, 65, 85)',
        color: 'white',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      {tooltip}
    </div>,
    document.body
  );

  return (
    <>
      <span
        ref={triggerRef}
        className={className}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </span>
      {tooltipElement}
    </>
  );
}
