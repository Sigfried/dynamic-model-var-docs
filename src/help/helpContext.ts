/**
 * The help context and its hook, kept out of HelpProvider.tsx so that file
 * exports only a component — Fast Refresh cannot hot-reload a module that
 * mixes components with other exports.
 */

import { createContext, useContext } from 'react';
import type { HelpContent, HelpEntry } from './parseHelpContent';

export interface HelpApi {
  helpMode: boolean;
  toggleHelpMode: () => void;
  exitHelpMode: () => void;
  /** Tour step index, or null when no tour is running. */
  tourStep: number | null;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  steps: HelpEntry[];
  content: HelpContent;
  activeId: string | null;
  showEntry: (id: string) => void;
  dismissEntry: () => void;
}

export const HelpContext = createContext<HelpApi | null>(null);

export function useHelp(): HelpApi {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used inside <HelpProvider>');
  return ctx;
}
