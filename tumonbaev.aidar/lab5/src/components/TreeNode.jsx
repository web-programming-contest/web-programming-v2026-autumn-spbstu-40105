import React, {useState} from 'react';

export default function TreeNode({node, level = 0}) {
  const [open, setOpen] = useState(true);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  return (
    <li className="tree-item" data-testid="tree-node">
      <div className="tree-row" data-testid="tree-level" data-level={level}>
        {hasChildren ? (
          <button
            type="button"
            className="tree-toggle"
            data-testid="tree-toggle"
            aria-expanded={open}
            aria-label={open ? 'Скрыть' : 'Раскрыть'}
            onClick={() => setOpen(!open)}
          >
            {open ? '−' : '+'}
          </button>
        ) : (
          <span className="tree-spacer" />
        )}
        <span className="tree-label">{node.title}</span>
      </div>

      {hasChildren && (
        <ul className="tree-list" data-testid="tree-branch" hidden={!open}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
