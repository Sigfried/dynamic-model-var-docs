import type { ElementCollection, ElementCollectionCallbacks } from '../models/Element';
import { useExpansionState } from '../hooks/useExpansionState';

interface SectionProps {
  collection: ElementCollection;
  callbacks: ElementCollectionCallbacks;
  position: 'left' | 'right';
}

export default function Section({ collection, callbacks, position }: SectionProps) {
  // Check if this collection needs expansion state
  const expansionKey = collection.getExpansionKey(position);
  const defaultExpansion = collection.getDefaultExpansion();

  // Use expansion state hook only if needed
  const [expandedItems, toggleExpansion] = expansionKey
    ? useExpansionState(expansionKey, defaultExpansion)
    : [undefined, undefined];

  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">{collection.getLabel()}</h2>
      </div>
      <div className="p-2">
        {collection.renderItems(callbacks, position, expandedItems, toggleExpansion)}
      </div>
    </div>
  );
}
