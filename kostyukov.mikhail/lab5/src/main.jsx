import React, {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const booksData = [
  {
    id: 'author-1',
    name: 'Дэниел Киз',
    type: 'author',
    typeLabel: 'Автор',
    children: [
      {
        id: 'pub-1-1',
        name: 'Эксмо',
        type: 'publisher',
        typeLabel: 'Издательство',
        children: [
          {
            id: 'genre-1-1-1',
            name: 'Научная фантастика',
            type: 'genre',
            typeLabel: 'Жанр',
            children: [
              {
                id: 'book-1-1-1-1',
                name: 'Цветы для Элджернона',
                type: 'book',
                typeLabel: 'Книга',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'author-2',
    name: 'Виктор Гюго',
    type: 'author',
    typeLabel: 'Автор',
    children: [
      {
        id: 'pub-2-1',
        name: 'Эксмо',
        type: 'publisher',
        typeLabel: 'Издательство',
        children: [
          {
            id: 'genre-2-1-1',
            name: 'Исторический роман',
            type: 'genre',
            typeLabel: 'Жанр',
            children: [
              {
                id: 'book-2-1-1-1',
                name: 'Человек, который смеется',
                type: 'book',
                typeLabel: 'Книга',
              },
              {
                id: 'book-2-1-1-2',
                name: 'Собор Парижской Богоматери',
                type: 'book',
                typeLabel: 'Книга',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'author-3',
    name: 'Говард Филлипс Лавкрафт',
    type: 'author',
    typeLabel: 'Автор',
    children: [
      {
        id: 'pub-3-1',
        name: 'АСТ',
        type: 'publisher',
        typeLabel: 'Издательство',
        children: [
          {
            id: 'genre-3-1-1',
            name: 'Ужасы',
            type: 'genre',
            typeLabel: 'Жанр',
            children: [
              {
                id: 'book-3-1-1-1',
                name: 'Серебряный ключ',
                type: 'book',
                typeLabel: 'Книга',
              },
              {
                id: 'book-3-1-1-2',
                name: 'Хребты безумия',
                type: 'book',
                typeLabel: 'Книга',
              },
              {
                id: 'book-3-1-1-3',
                name: 'Зов Ктулху',
                type: 'book',
                typeLabel: 'Книга',
              },
            ],
          },
        ],
      },
    ],
  },
];

function TreeNode({item}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = Boolean(item.children && item.children.length > 0);

  return (
    <li
      className="tree-item"
      role="treeitem"
      aria-expanded={hasChildren ? isOpen : undefined}
      data-testid={hasChildren ? 'tree-branch' : 'tree-leaf'}
    >
      {hasChildren ? (
        <button
          type="button"
          className="tree-node-button"
          data-testid="tree-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="tree-arrow">{isOpen ? '|' : '>'}</span>
          <span
            data-testid="tree-level"
            className={`tree-badge tree-badge-${item.type}`}
          >
            {item.typeLabel}
          </span>
          <span className="tree-label">{item.name}</span>
        </button>
      ) : (
        <div className="tree-leaf-content">
          <span className="tree-bullet">•</span>
          <span
            data-testid="tree-level"
            className={`tree-badge tree-badge-${item.type}`}
          >
            {item.typeLabel}
          </span>
          <span className="tree-label">{item.name}</span>
        </div>
      )}

      {hasChildren && isOpen && (
        <ul className="tree-group" role="group">
          {item.children.map((child) => (
            <TreeNode key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function App() {
  return (
    <section className="catalog-card">
      <header className="catalog-header">
        <h1 className="catalog-title">Каталог книг</h1>
        <p className="catalog-description">
          Иерархический список: Автор → Издательство → Жанр → Книга
        </p>
      </header>

      <div className="catalog-tree-wrapper" data-testid="tree">
        <ul className="tree-root" role="tree">
          {booksData.map((author) => (
            <TreeNode key={author.id} item={author} />
          ))}
        </ul>
      </div>
    </section>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
