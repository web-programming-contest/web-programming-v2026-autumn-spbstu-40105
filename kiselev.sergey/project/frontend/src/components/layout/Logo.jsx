import {Link} from 'react-router-dom';

export default function Logo({className = ''}) {
  return (
    <Link
      to="/"
      className={`logo ${className}`}
      aria-label="Gadget Hub, главная"
    >
      <span className="logo-accent">Gadget</span> Hub
    </Link>
  );
}
