import NoteItem from './NoteItem.jsx';

function NoteList({notes, totalCount, activeId, onSelect, onDelete}) {
  const isEmpty = notes.length === 0;
  const isFiltered = totalCount > 0 && isEmpty;

  return (
    <div data-testid="note-list" className="note-list">
      {isEmpty ? (
        <p className="empty-hint">
          {isFiltered ? 'Ничего не найдено' : 'Заметок пока нет'}
        </p>
      ) : (
        notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isActive={note.id === activeId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

export default NoteList;
