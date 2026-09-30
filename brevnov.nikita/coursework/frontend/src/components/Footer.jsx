import mobileIcon from '../assets/images/icons/mobile.svg';
import telegramIcon from '../assets/images/social/telegram.png';
import vkIcon from '../assets/images/social/vk.png';
import whatsappIcon from '../assets/images/social/whatsapp.png';
import './footer.css';

// Подвал одинаковый на всех страницах (4.1): ссылки на соцсети и телефоны.
export function Footer() {
  return (
    <footer className="footer">
      <div className="page-container footer-inner">
        <div className="footer-contacts">
          <img src={mobileIcon} alt="" aria-hidden="true" />
          <a href="tel:+78121234567">+7 (812) 123-45-67</a>
        </div>

        <div className="footer-social">
          <a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram">
            <img src={telegramIcon} alt="" aria-hidden="true" />
          </a>
          <a href="https://vk.com/" target="_blank" rel="noreferrer" aria-label="ВКонтакте">
            <img src={vkIcon} alt="" aria-hidden="true" />
          </a>
          <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <img src={whatsappIcon} alt="" aria-hidden="true" />
          </a>
        </div>

        <p className="footer-copy">© 2026 Gadget Hub</p>
      </div>
    </footer>
  );
}
