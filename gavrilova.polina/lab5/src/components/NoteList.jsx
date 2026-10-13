import NoteItem from "./NoteItem.jsx";

function NoteList({ notes }) {
  return (
    <div data-testid="note-list" className="note-list">
      {notes.length === 0 ? (
        <p className="empty-hint">Заметок пока нет</p>
      ) : (
        notes.map((note) => <NoteItem key={note.id} note={note} />)
      )}
    </div>
  );
}

export default NoteList;