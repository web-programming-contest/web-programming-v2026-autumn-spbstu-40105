import React, {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem('tasks');
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  });

  const [description, setDescription] = useState('');

  const [currentFilter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') {
      return !task.isDone;
    } else if (currentFilter === 'completed') {
      return task.isDone;
    }
    return true;
  });

  const addTaskOnSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: crypto.randomUUID(),
      description,
      isDone: false,
    };

    setTasks([...tasks, newTask]);
    setDescription('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        return task.id === id ? {...task, isDone: !task.isDone} : task;
      }),
    );
  };

  const deleteTask = (id) =>
    setTasks(
      tasks.filter((task) => {
        return task.id !== id;
      }),
    );

  return (
    <div className="app">
      <h1>МОИ ЗАДАЧИ</h1>
      <form onSubmit={addTaskOnSubmit} className="task-adding-form">
        <input
          onChange={(e) => {
            setDescription(e.target.value.trim());
          }}
          value={description}
          data-testid="todo-input"
          type="text"
          required
          placeholder="Введите новую задачу"
        />
        <button data-testid="todo-add" type="submit">
          ДОБАВИТЬ
        </button>
      </form>
      <hr />
      <div className="filters-box">
        <button
          onClick={() => setFilter('all')}
          type="button"
          data-testid="todo-filter"
          className={currentFilter === 'all' ? 'active' : ''}
        >
          ВСЕ
        </button>
        <button
          onClick={() => setFilter('active')}
          type="button"
          data-testid="todo-filter"
          className={currentFilter === 'active' ? 'active' : ''}
        >
          АКТИВНЫЕ
        </button>
        <button
          onClick={() => setFilter('completed')}
          type="button"
          data-testid="todo-filter"
          className={currentFilter === 'completed' ? 'active' : ''}
        >
          ВЫПОЛНЕННЫЕ
        </button>
      </div>
      <ul className="task-list" data-testid="todo-list">
        {filteredTasks.length === 0 ? (
          <li>Нет задач</li>
        ) : (
          filteredTasks.map((task) => (
            <li data-testid="todo-item" className="task" key={task.id}>
              <span className={`task-description ${task.isDone ? 'done' : ''}`}>
                {task.description}
              </span>
              <input
                onChange={() => toggleTask(task.id)}
                type="checkbox"
                checked={task.isDone}
              />
              <button
                onClick={() => deleteTask(task.id)}
                type="button"
                className="delete-task-button"
              >
                🗑
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
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
