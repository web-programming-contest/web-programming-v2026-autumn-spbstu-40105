function NoteItem({ note, onEdit, onDelete }) {
  const created = new Date(note.createdAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article data-testid="note-item" className="note-item">
      <h3 className="note-item-title">{note.title}</h3>
      <p className="note-item-content">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="note-item-date">{created}</p>

      <div className="note-item-actions">
        <button
          type="button"
          className="note-item-edit"
          onClick={() => onEdit(note.id)}
        >
          Редактировать
        </button>
        <button
          type="button"
          className="note-item-delete"
          onClick={() => onDelete(note.id)}
        >
          Удалить
        </button>
      </div>
    </article>
  );
}

export default NoteItem;