import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
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

function matchesSearch(note, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    note.title.toLowerCase().includes(q) ||
    note.content.toLowerCase().includes(q)
  );
}

function matchesTag(note, tag) {
  if (tag === "all") return true;
  return note.tags.includes(tag);
}

function matchesDate(note, filter) {
  if (filter === "all") return true;

  const created = new Date(note.createdAt).getTime();
  const now = Date.now();

  if (filter === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return created >= start.getTime();
  }
  if (filter === "week") {
    return created >= now - 7 * 24 * 60 * 60 * 1000;
  }
  if (filter === "month") {
    return created >= now - 30 * 24 * 60 * 60 * 1000;
  }
  return true;
}

function getAllTags(notes) {
  const set = new Set();
  notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
  return [...set].sort();
}

function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const editingNote = notes.find((n) => n.id === editingId) || null;
  const allTags = getAllTags(notes);
  const visibleNotes = notes
    .filter((n) => matchesSearch(n, searchQuery))
    .filter((n) => matchesTag(n, activeTag))
    .filter((n) => matchesDate(n, dateFilter));

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

  function handleSelectNote(id) {
    setEditingId(id);
  }

  function handleCancelEdit() {
    setEditingId(null);
  }

  function handleDeleteNote(id) {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);

    if (editingId === id) {
      setEditingId(null);
    }

    const remainingTags = getAllTags(updated);
    if (activeTag !== "all" && !remainingTags.includes(activeTag)) {
      setActiveTag("all");
    }
  }

  return (
    <main data-testid="app" className="app">
      <header className="app-header">
        <h1 className="app-title">Заметки</h1>
      </header>

      <div className="app-controls">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar
          tags={allTags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
        />
      </div>

      <div className="app-body">
        <aside className="app-sidebar">
          <div className="app-sidebar-header">
            <span className="app-sidebar-count">
              {visibleNotes.length} из {notes.length}
            </span>
          </div>
          <NoteList
            notes={visibleNotes}
            totalCount={notes.length}
            activeId={editingId}
            onSelect={handleSelectNote}
            onDelete={handleDeleteNote}
          />
        </aside>

        <section className="app-editor">
          <NoteForm
            editingNote={editingNote}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
            onDelete={handleDeleteNote}
          />
        </section>
      </div>
    </main>
  );
}

export default App;