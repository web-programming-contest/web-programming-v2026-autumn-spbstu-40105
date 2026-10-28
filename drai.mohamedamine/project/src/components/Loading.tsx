import { LoaderCircle } from 'lucide-react'

export function Loading({ label = 'Загружаем товары…' }: { label?: string }) {
  return <div className="loading" role="status"><LoaderCircle className="spin" aria-hidden="true" /><span>{label}</span></div>
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="empty-state"><h2>Что-то пошло не так</h2><p>{message}</p><button type="button" className="button button--primary" onClick={onRetry}>Повторить</button></div>
}
