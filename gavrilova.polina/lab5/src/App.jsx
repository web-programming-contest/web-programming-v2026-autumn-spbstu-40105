import { useState } from "react";
import NoteForm from "./components/NoteForm.jsx";
import NoteList from "./components/NoteList.jsx";

function App() {
  const [notes, setNotes] = useState([]);

  function handleAddNote(title, content) {
    const newNote = {
      id: crypto.randomUUID(),
      title,
      content,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([...notes, newNote]);
  }

  return (
    <main data-testid="app">
      <h1>Заметки</h1>
      <NoteForm onAdd={handleAddNote} />
      <NoteList notes={notes} />
    </main>
  );
}

export default App;