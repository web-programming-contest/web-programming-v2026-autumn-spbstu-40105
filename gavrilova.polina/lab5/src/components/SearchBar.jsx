function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        data-testid="note-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по заметкам..."
        aria-label="Поиск по заметкам"
      />
    </div>
  );
}

export default SearchBar;