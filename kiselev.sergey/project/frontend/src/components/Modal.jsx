import {useEffect, useRef} from 'react';

export default function Modal({
  isOpen,
  onClose,
  label,
  className = '',
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleClick(event) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${className}`}
      aria-label={label}
      onClose={onClose}
      onClick={handleClick}
    >
      {isOpen && (
        <div className="modal-body">
          <button
            type="button"
            className="modal-close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
