export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #eee',
        padding: '20px 0',
        marginTop: '40px',
        color: '#666',
        fontSize: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p>© 2024 ООО “Гаджет Хаб”. Все права защищены</p>
          <p>8(800) 678-34-24 | Магазин надежных гаджетов</p>
        </div>
        <div style={{display: 'flex', gap: '16px'}}>
          <span>Telegram</span>
          <span>VK</span>
          <span>WhatsApp</span>
        </div>
      </div>
    </footer>
  );
}
