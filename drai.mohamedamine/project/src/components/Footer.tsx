import { Logo } from './Logo'

const socials = [
  { name: 'ВКонтакте', image: '/images/social/vk.png', href: 'https://vk.com/' },
  { name: 'Telegram', image: '/images/social/telegram.png', href: 'https://telegram.org/' },
  { name: 'WhatsApp', image: '/images/social/whatsapp.png', href: 'https://www.whatsapp.com/' },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div><Logo inverse /><p>Магазин надежных гаджетов</p></div>
        <div className="footer-contact"><span>Работаем 24/7</span><a href="tel:88006783424">8 (800) 678-34-24</a><a href="mailto:gadget@hub.ru">gadget@hub.ru</a></div>
        <div className="socials" aria-label="Социальные сети">
          {socials.map((social) => <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}><img src={social.image} alt="" /></a>)}
        </div>
      </div>
      <div className="container footer-bottom">© 2024 ООО «Гаджет Хаб». Все права защищены</div>
    </footer>
  )
}
