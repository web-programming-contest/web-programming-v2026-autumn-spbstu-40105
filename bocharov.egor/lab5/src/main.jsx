import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const questions = [
  {
    id: 'accordion',
    question: 'Что такое аккордеон?',
    answer:
      'Это список разделов, содержимое которых можно раскрывать и сворачивать.',
  },
  {
    id: 'mode',
    question: 'Можно ли открыть несколько ответов?',
    answer:
      'Да. Включите флажок над списком, чтобы открывать ответы независимо.',
  },
  {
    id: 'keyboard',
    question: 'Как пользоваться аккордеоном с клавиатуры?',
    answer:
      'Нажмите Tab, чтобы выбрать вопрос, затем Enter или пробел, чтобы открыть ответ.',
  },  
];

function FaqItem({item, isOpen, onToggle}) {
  const questionId = `question-${item.id}`;
  const answerId = `answer-${item.id}`;

  return (
    <article className="faq-item" data-testid="faq-item">
      <h2>
        <button
          id={questionId}
          type="button"
          data-testid="faq-toggle"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={() => onToggle(item.id)}
        >
          {item.question}
        </button>
      </h2>
      <div
        id={answerId}
        className="faq-answer"
        data-testid="faq-answer"
        data-open={isOpen}
        role="region"
        aria-labelledby={questionId}
        aria-hidden={!isOpen}
      >
        <div className="answer-content">
          <p>{item.answer}</p>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [openIds, setOpenIds] = useState([]);

  function toggleAnswer(id) {
    setOpenIds((current) => {
      if (current.includes(id)) {
        return current.filter((openId) => openId !== id);
      }

      return allowMultiple ? [...current, id] : [id];
    });
  }

  function changeMode(event) {
    const checked = event.target.checked;
    setAllowMultiple(checked);

    if (!checked) {
      setOpenIds((current) => current.slice(-1));
    }
  }

  return (
    <>
      <h1>Часто задаваемые вопросы</h1>
      <label className="faq-mode">
        <input type="checkbox" checked={allowMultiple} onChange={changeMode} />
        Открывать несколько ответов одновременно
      </label>
      {questions.map((item) => (
        <FaqItem
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={toggleAnswer}
        />
      ))}
    </>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
