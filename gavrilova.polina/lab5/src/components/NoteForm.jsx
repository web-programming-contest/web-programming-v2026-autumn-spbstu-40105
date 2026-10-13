import { useEffect, useState } from "react";

function parseTags(input) {
  const tags = input
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
  return [...new Set(tags)];
}

function NoteForm({ editingNote, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const isEditing = editingNote !== null;

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setTagsInput(editingNote.tags.join(", "));
    } else {
      setTitle("");
      setContent("");
      setTagsInput("");
    }
  }, [editingNote]);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    const tags = parseTags(tagsInput);

    onSave(trimmedTitle, trimmedContent, tags);

    if (!isEditing) {
      setTitle("");
      setContent("");
      setTagsInput("");
    }
  }

  function handleCancel() {
    onCancel();
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

      <input
        type="text"
        data-testid="note-tags"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="Теги через запятую: работа, важно"
        aria-label="Теги заметки"
      />

      <div className="note-form-actions">
        <button type="submit" data-testid="note-add">
          {isEditing ? "Сохранить" : "Добавить"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="note-form-cancel"
            onClick={handleCancel}
          >
            Отменить
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;