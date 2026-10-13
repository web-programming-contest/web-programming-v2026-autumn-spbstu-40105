import { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm.jsx";
import NoteList from "./components/NoteList.jsx";

const STORAGE_KEY = "lab5_notes";

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const editingNote = notes.find((n) => n.id === editingId) || null;

  function handleSaveNote(title, content, tags) {
    if (editingId) {
      const updatedAt = new Date().toISOString();
      setNotes(
        notes.map((n) =>
          n.id === editingId ? { ...n, title, content, tags, updatedAt } : n,
        ),
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title,
        content,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([...notes, newNote]);
    }
  }

  function handleEditNote(id) {
    setEditingId(id);
  }

  function handleCancelEdit() {
    setEditingId(null);
  }

  function handleDeleteNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  return (
    <main data-testid="app">
      <h1>Заметки</h1>
      <NoteForm
        editingNote={editingNote}
        onSave={handleSaveNote}
        onCancel={handleCancelEdit}
      />
      <NoteList
        notes={notes}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
      />
    </main>
  );
}

export default App;