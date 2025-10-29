/**
 * Generic tree data structure
 * Used for hierarchical elements (classes, grouped variables, etc.)
 */

import type { RenderableItem } from './RenderableItem';

export interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
  parent?: TreeNode<T>;
}

/**
 * Element interface constraint for toRenderableItems()
 * Requires minimal properties that Element base class provides
 */
interface ElementLike {
  type: string;
  name: string;
  getBadge?(): number | undefined;
}

export class Tree<T> {
  readonly roots: TreeNode<T>[];

  constructor(roots: TreeNode<T>[]) {
    this.roots = roots;
  }

  /**
   * Flatten the tree into a list, depth-first
   */
  flatten(): T[] {
    const result: T[] = [];

    const traverse = (node: TreeNode<T>) => {
      result.push(node.data);
      node.children.forEach(traverse);
    };

    this.roots.forEach(traverse);
    return result;
  }

  /**
   * Find a node by a predicate function
   */
  find(predicate: (data: T) => boolean): TreeNode<T> | null {
    const search = (node: TreeNode<T>): TreeNode<T> | null => {
      if (predicate(node.data)) return node;

      for (const child of node.children) {
        const found = search(child);
        if (found) return found;
      }

      return null;
    };

    for (const root of this.roots) {
      const found = search(root);
      if (found) return found;
    }

    return null;
  }

  /**
   * Get all nodes at a specific level (0 = roots)
   */
  getLevel(level: number): TreeNode<T>[] {
    if (level === 0) return this.roots;

    const result: TreeNode<T>[] = [];
    const traverse = (node: TreeNode<T>, currentLevel: number) => {
      if (currentLevel === level) {
        result.push(node);
      } else {
        node.children.forEach(child => traverse(child, currentLevel + 1));
      }
    };

    this.roots.forEach(root => traverse(root, 0));
    return result;
  }

  /**
   * Map over all nodes in the tree
   */
  map<U>(fn: (data: T, level: number) => U): Tree<U> {
    const mapNode = (node: TreeNode<T>, level: number): TreeNode<U> => {
      const mapped: TreeNode<U> = {
        data: fn(node.data, level),
        children: [],
        parent: undefined
      };

      mapped.children = node.children.map(child => {
        const childNode = mapNode(child, level + 1);
        childNode.parent = mapped;
        return childNode;
      });

      return mapped;
    };

    return new Tree(this.roots.map(root => mapNode(root, 0)));
  }

  /**
   * Convert tree to flat list of RenderableItems for display
   * Respects expansion state to hide/show children
   *
   * @param expandedItems Set of item names that are expanded
   * @param getIsClickable Optional callback to determine if item is clickable (default: all true)
   * @returns Flat list of RenderableItems with level and expansion info
   */
  toRenderableItems(
    expandedItems: Set<string>,
    getIsClickable?: (node: TreeNode<T>, level: number) => boolean
  ): RenderableItem[] {
    // Type constraint: T must be ElementLike
    if (!this.roots.length) return [];

    const items: RenderableItem[] = [];

    const traverse = (node: TreeNode<T>, level: number) => {
      const element = node.data as unknown as ElementLike;
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedItems.has(element.name);
      const isClickable = getIsClickable ? getIsClickable(node, level) : true;

      items.push({
        id: `${element.type}-${element.name}`,
        element: node.data,
        level,
        hasChildren,
        isExpanded,
        isClickable,
        badge: element.getBadge?.()
      });

      // Only traverse children if expanded
      if (isExpanded) {
        node.children.forEach(child => traverse(child, level + 1));
      }
    };

    this.roots.forEach(root => traverse(root, 0));
    return items;
  }
}

/**
 * Build a tree from flat data with parent references
 */
export function buildTree<T>(
  items: T[],
  getId: (item: T) => string,
  getParentId: (item: T) => string | undefined
): Tree<T> {
  const nodeMap = new Map<string, TreeNode<T>>();
  const roots: TreeNode<T>[] = [];

  // First pass: create all nodes
  items.forEach(item => {
    nodeMap.set(getId(item), {
      data: item,
      children: [],
      parent: undefined
    });
  });

  // Second pass: link parent-child relationships
  items.forEach(item => {
    const node = nodeMap.get(getId(item))!;
    const parentId = getParentId(item);

    if (parentId) {
      const parent = nodeMap.get(parentId);
      if (parent) {
        parent.children.push(node);
        node.parent = parent;
      } else {
        // Parent not found, treat as root
        roots.push(node);
      }
    } else {
      // No parent, this is a root
      roots.push(node);
    }
  });

  return new Tree(roots);
}
