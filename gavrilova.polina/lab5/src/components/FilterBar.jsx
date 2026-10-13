function FilterBar({
  tags,
  activeTag,
  onTagChange,
  dateFilter,
  onDateChange,
}) {
  const dateOptions = [
    { value: "all", label: "Все" },
    { value: "today", label: "Сегодня" },
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <span className="filter-label">Теги:</span>
        <button
          type="button"
          className={`filter-chip${activeTag === "all" ? " active" : ""}`}
          onClick={() => onTagChange("all")}
        >
          Все
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`filter-chip${activeTag === tag ? " active" : ""}`}
            onClick={() => onTagChange(tag)}
          >
            #{tag}
          </button>
        ))}
        {tags.length === 0 && (
          <span className="filter-hint">Тегов пока нет</span>
        )}
      </div>

      <div className="filter-row">
        <span className="filter-label">Дата:</span>
        {dateOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`filter-chip${dateFilter === opt.value ? " active" : ""}`}
            onClick={() => onDateChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;