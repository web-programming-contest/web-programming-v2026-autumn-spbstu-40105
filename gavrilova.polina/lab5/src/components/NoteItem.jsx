function NoteItem({note, isActive, onSelect, onDelete}) {
  const preview = note.content.length > 80 ? `${note.content.slice(0, 80)  }…` : note.content;

  const date = new Date(note.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  function handleClick() {
    onSelect(note.id);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(note.id);
    }
  }

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(note.id);
  }

  return (
    <article
      data-testid="note-item"
      className={`note-item${isActive ? ' active' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="note-item-head">
        <h3 className="note-item-title">{note.title}</h3>
        <button
          type="button"
          className="note-item-delete"
          aria-label={`Удалить заметку «${note.title}»`}
          onClick={handleDelete}
        >
          ×
        </button>
      </div>

      <p className="note-item-preview">{preview}</p>

      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="note-item-date">{date}</p>
    </article>
  );
}

export default NoteItem;
