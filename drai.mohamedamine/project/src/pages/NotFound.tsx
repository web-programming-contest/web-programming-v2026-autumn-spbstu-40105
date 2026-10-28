import { Link } from 'react-router'

export default function NotFound() {
  return <div className="container empty-state not-found"><span>404</span><h1>Страница не найдена</h1><p>Возможно, ссылка устарела или страница была перемещена.</p><Link to="/" className="button button--primary">На главную</Link></div>
}
