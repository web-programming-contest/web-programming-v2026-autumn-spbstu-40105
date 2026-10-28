import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Check, PackageOpen, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { api, ApiError } from '@/lib/api'
import { formatDate, formatPrice, pluralGoods } from '@/lib/format'
import type { CheckoutData, Order } from '@/types/store'
import { QuantityControl } from '@/components/QuantityControl'
import { Loading } from '@/components/Loading'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const INITIAL_FORM: CheckoutData = { email: '', phone: '', fulfillment: 'delivery', address: '', payment: 'card', gift_wrap: false }

export default function Cart() {
  const { items, removeMany, clear } = useCart()
  const { products } = useProducts()
  const [tab, setTab] = useState<'cart' | 'history'>('cart')
  const [selected, setSelected] = useState<number[]>([])
  const [confirmIds, setConfirmIds] = useState<number[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')
  const [form, setForm] = useState<CheckoutData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [pending, setPending] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  const cartProducts = useMemo(() => products.filter((product) => items[product.id]), [products, items])
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price * items[product.id], 0)
  const total = subtotal + (form.gift_wrap ? 290 : 0)
  const totalCount = Object.values(items).reduce((sum, quantity) => sum + quantity, 0)

  const loadOrders = useCallback(() => {
    setOrdersLoading(true)
    setOrdersError('')
    api.orders().then(setOrders).catch(() => setOrdersError('Не удалось загрузить историю заказов.')).finally(() => setOrdersLoading(false))
  }, [])
  useEffect(loadOrders, [loadOrders])

  const updateForm = <K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (form.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Введите корректный номер телефона'
    if (form.fulfillment === 'delivery' && !form.address.trim()) nextErrors.address = 'Заполните обязательное поле'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Введите корректный адрес почты'
    setErrors(nextErrors)
    setServerError('')
    if (Object.keys(nextErrors).length) return

    setPending(true)
    try {
      const order = await api.createOrder(form, cartProducts.map((product) => ({ product_id: product.id, quantity: items[product.id] })))
      setCompletedOrder(order)
      clear()
      setSelected([])
      setForm(INITIAL_FORM)
      loadOrders()
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : 'Не удалось оформить заказ. Попробуйте еще раз.')
    } finally {
      setPending(false)
    }
  }

  const confirmRemove = () => {
    removeMany(confirmIds)
    setSelected((current) => current.filter((id) => !confirmIds.includes(id)))
    setConfirmIds([])
  }

  return (
    <div className="container cart-page">
      <h1>Корзина и заказы</h1>
      <div className="tabs" role="tablist" aria-label="Корзина и история">
        <button type="button" role="tab" aria-selected={tab === 'cart'} className={tab === 'cart' ? 'active' : ''} onClick={() => setTab('cart')}><ShoppingBag size={20} />Корзина{totalCount > 0 && <span>{totalCount}</span>}</button>
        <button type="button" role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>История заказов</button>
      </div>

      {tab === 'history' ? (
        <section className="order-history" aria-label="История заказов">
          {ordersLoading ? <Loading label="Загружаем историю…" /> : ordersError ? <div className="empty-state"><p>{ordersError}</p><button type="button" className="button button--primary" onClick={loadOrders}>Повторить</button></div> : orders.length === 0 ? (
            <div className="empty-state"><PackageOpen size={42} /><h2>Заказов пока нет</h2><p>Оформите первый заказ — он появится здесь.</p><button type="button" className="button button--primary" onClick={() => setTab('cart')}>Перейти в корзину</button></div>
          ) : orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card__summary"><div><span>Заказ №{order.id}</span><time>{formatDate(order.created_at)}</time></div><div><span>{order.item_count} {pluralGoods(order.item_count)}</span><strong>{formatPrice(order.total)}</strong></div></div>
              <div className="order-card__details"><span>{order.fulfillment_display}{order.address ? ` · ${order.address}` : ''}</span><span>Оплата: {order.payment_display.toLowerCase()}</span></div>
              <ul>{order.items.map((item) => <li key={item.id}><img src={item.image} alt="" /><span>{item.product_name}</span><span>{item.quantity} шт. × {formatPrice(item.price)}</span></li>)}</ul>
            </article>
          ))}
        </section>
      ) : completedOrder ? (
        <section className="order-success" role="status"><span><Check size={40} /></span><h2>Спасибо, ваш заказ успешно оформлен</h2><p>Номер заказа — №{completedOrder.id}. Мы свяжемся с вами для подтверждения.</p><div><Link to="/catalog" className="button button--primary">Продолжить покупки</Link><button type="button" className="button button--secondary" onClick={() => setTab('history')}>История заказов</button></div></section>
      ) : cartProducts.length === 0 ? (
        <section className="empty-state cart-empty"><PackageOpen size={48} /><h2>Пока пусто</h2><p>Ознакомьтесь с новинками и хитами на главной или найдите нужное в каталоге.</p><Link to="/catalog" className="button button--primary">Перейти в каталог</Link></section>
      ) : (
        <div className="cart-layout">
          <section className="cart-list" aria-label="Товары в корзине">
            <div className="cart-list__toolbar"><label className="check-label"><input type="checkbox" checked={selected.length === cartProducts.length} onChange={(event) => setSelected(event.target.checked ? cartProducts.map((p) => p.id) : [])} /><span>Выбрать все</span></label><button type="button" className="text-button text-button--danger" disabled={!selected.length} onClick={() => setConfirmIds(selected)}><Trash2 size={17} />Удалить выбранные</button></div>
            {cartProducts.map((product) => (
              <article className="cart-item" key={product.id}>
                <input className="cart-item__check" type="checkbox" checked={selected.includes(product.id)} onChange={() => setSelected((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} aria-label={`Выбрать ${product.name}`} />
                <img src={product.image} alt={product.name} />
                <div className="cart-item__info"><span>{product.category_display}</span><h2>{product.name}</h2><small>{formatPrice(product.price)} за шт.</small></div>
                <QuantityControl productId={product.id} compact />
                <strong className="cart-item__total">{formatPrice(product.price * items[product.id])}</strong>
                <button type="button" className="delete-button" onClick={() => setConfirmIds([product.id])} aria-label={`Удалить ${product.name}`}><Trash2 /></button>
              </article>
            ))}
          </section>

          <section className="checkout" aria-labelledby="checkout-title">
            <h2 id="checkout-title">Оформление заказа</h2>
            <form onSubmit={submitOrder} noValidate>
              <div className={`field ${errors.email ? 'field--error' : ''}`}><label htmlFor="email">Почта <span>необязательно</span></label><input id="email" type="email" autoComplete="email" placeholder="name@example.ru" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />{errors.email && <span className="field-error">{errors.email}</span>}</div>
              <div className={`field ${errors.phone ? 'field--error' : ''}`}><label htmlFor="phone">Номер телефона</label><input id="phone" type="tel" autoComplete="tel" placeholder="+7 (999) 123-45-67" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className="field-error">{errors.phone}</span>}</div>
              <fieldset className="checkout__radios"><legend>Способ получения</legend><label className="check-label"><input type="radio" name="fulfillment" checked={form.fulfillment === 'delivery'} onChange={() => updateForm('fulfillment', 'delivery')} />Доставка</label><label className="check-label"><input type="radio" name="fulfillment" checked={form.fulfillment === 'pickup'} onChange={() => updateForm('fulfillment', 'pickup')} />Самовывоз</label></fieldset>
              {form.fulfillment === 'delivery' && <div className={`field ${errors.address ? 'field--error' : ''}`}><label htmlFor="address">Адрес доставки</label><input id="address" autoComplete="street-address" placeholder="Город, улица, дом, квартира" value={form.address} onChange={(e) => updateForm('address', e.target.value)} aria-invalid={Boolean(errors.address)} />{errors.address && <span className="field-error">{errors.address}</span>}</div>}
              <div className="field"><label htmlFor="payment">Оплата</label><select id="payment" value={form.payment} onChange={(e) => updateForm('payment', e.target.value as 'card' | 'cash')}><option value="card">По карте</option><option value="cash">Наличными</option></select></div>
              <label className="check-label gift-option"><input type="checkbox" checked={form.gift_wrap} onChange={(e) => updateForm('gift_wrap', e.target.checked)} /><span>Добавить подарочную упаковку <b>+290 ₽</b></span></label>
              {serverError && <div className="form-alert" role="alert">{serverError}</div>}
              <dl className="order-totals"><div><dt>{totalCount} {pluralGoods(totalCount)}</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Доставка</dt><dd>Бесплатно</dd></div>{form.gift_wrap && <div><dt>Упаковка</dt><dd>290 ₽</dd></div>}<div className="order-totals__total"><dt>Итого</dt><dd>{formatPrice(total)}</dd></div></dl>
              <button type="submit" className="button button--primary button--wide" disabled={pending}>{pending ? 'Оформляем…' : 'Оформить заказ'}</button>
            </form>
          </section>
        </div>
      )}

      <AlertDialog open={confirmIds.length > 0} onOpenChange={(open) => { if (!open) setConfirmIds([]) }}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Вы уверены, что хотите удалить?</AlertDialogTitle><AlertDialogDescription>{confirmIds.length > 1 ? 'Выбранные товары будут удалены из корзины.' : 'Товар будет удален из корзины.'}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Отмена</AlertDialogCancel><AlertDialogAction className="button--danger" onClick={confirmRemove}>Удалить</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
