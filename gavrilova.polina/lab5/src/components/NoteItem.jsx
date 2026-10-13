function NoteItem({ note }) {
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
      <p className="note-item-date">{created}</p>
    </article>
  );
}

export default NoteItem;