import { useState } from "react";

function NoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    onAdd(trimmedTitle, trimmedContent);
    setTitle("");
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        data-testid="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок"
        aria-label="Заголовок заметки"
      />

      <textarea
        data-testid="note-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Текст заметки"
        aria-label="Текст заметки"
        rows={3}
      />

      <button type="submit" data-testid="note-add">
        Добавить
      </button>
    </form>
  );
}

export default NoteForm;