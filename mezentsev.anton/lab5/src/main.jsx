import React, {useId, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {books, buildTree, getBranchIds} from './data.js';
import './styles.css';

const tree = buildTree(books);
const branchIds = getBranchIds(tree);
const levelNames = ['Автор', 'Издательство', 'Жанр', 'Книга'];

function TreeNode({node, level, expanded, onToggle}) {
  const regionId = useId();
  const isBranch = Boolean(node.children);
  const isOpen = expanded.has(node.id);

  return (
    <li className="tree-node" data-testid="tree-level" data-level={level + 1}>
      {isBranch ? (
        <>
          <button
            type="button"
            className={`branch-toggle ${isOpen ? 'is-open' : ''}`}
            data-testid="tree-toggle"
            aria-expanded={isOpen}
            aria-controls={regionId}
            onClick={() => onToggle(node.id)}
          >
            <span className="chevron" aria-hidden="true">
              {isOpen ? '−' : '+'}
            </span>
            <span className="node-text">
              <span className="level-label">{levelNames[level]}</span>
              <span className="node-name">{node.label}</span>
            </span>
            <span className="count" aria-label={`Книг: ${node.count}`}>
              {node.count}
            </span>
          </button>
          <ul
            id={regionId}
            className="tree-branch"
            data-testid="tree-branch"
            hidden={!isOpen}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="book-leaf">
          <span className="book-mark" aria-hidden="true">
            ▤
          </span>
          <span className="node-text">
            <span className="level-label">Книга</span>
            <span className="node-name">{node.label}</span>
          </span>
        </div>
      )}
    </li>
  );
}

function App() {
  // Изначально видны все четыре уровня. Каждая ветка независима.
  const [expanded, setExpanded] = useState(() => new Set(branchIds));

  function toggleBranch(id) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="app" data-testid="app">
      <header className="page-header">
        <p className="eyebrow">Книжная полка / Каталог</p>
        <h1>Истории по полочкам</h1>
        <p className="intro">
          От любимого автора — к следующей книге. Раскрывайте ветки и исследуйте
          коллекцию.
        </p>
        <p className="summary">
          {tree.length} автора · {books.length} книг · 4 уровня
        </p>
      </header>

      <section className="catalog" aria-label="Каталог книг">
        <div className="toolbar">
          <h2>Коллекция</h2>
          <div className="toolbar-actions">
            <button
              type="button"
              className="action"
              onClick={() => setExpanded(new Set(branchIds))}
            >
              Раскрыть всё
            </button>
            <button
              type="button"
              className="action"
              onClick={() => setExpanded(new Set())}
            >
              Свернуть всё
            </button>
          </div>
        </div>
        <p className="hierarchy">
          Автор → Издательство → Жанр → Название книги
        </p>
        <ul className="tree" data-testid="tree">
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              expanded={expanded}
              onToggle={toggleBranch}
            />
          ))}
        </ul>
      </section>
      <footer>Лабораторная работа 5 · Вариант 28 · Учебный каталог</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
