import Logo from './Logo.jsx';

const SOCIAL_LINKS = [
  {name: 'ВКонтакте', icon: 'vk', href: 'https://vk.com/'},
  {name: 'Telegram', icon: 'telegram', href: 'https://t.me/'},
  {name: 'WhatsApp', icon: 'whatsapp', href: 'https://www.whatsapp.com/'},
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-about">
          <Logo className="logo-light" />
          <p className="footer-slogan">Магазин надежных гаджетов</p>
          <p className="footer-copyright">
            © 2024 ООО “Гаджет Хаб”. Все права защищены
          </p>
        </div>
        <a className="footer-phone" href="tel:88006783424">
          <img src="/images/icons/mobile.svg" alt="" width="22" height="32" />8
          (800) 678-34-24
        </a>
        <ul className="footer-social">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.icon}>
              <a
                className="footer-social-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`/images/social/${link.icon}.png`}
                  alt={link.name}
                  width="32"
                  height="32"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
