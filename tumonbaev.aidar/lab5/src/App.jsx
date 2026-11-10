import React from 'react';
import TreeNode from './components/TreeNode.jsx';
import {catalog} from './data.js';

export default function App() {
  return (
    <>
      <h1 className="page-title">Книжный магазин</h1>
      <ul className="tree-list tree-root" data-testid="tree">
        {catalog.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </>
  );
}
