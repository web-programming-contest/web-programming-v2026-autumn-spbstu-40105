export interface User {
  id: number
  username: string
}

export interface Product {
  id: number
  name: string
  description: string
  category: string
  category_display: string
  color: string
  color_display: string
  price: number
  rating: number
  image: string
  is_new: boolean
  is_hit: boolean
  specs: Record<string, string>
  created_at: string
}

export interface OrderItem {
  id: number
  product: number
  product_name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: number
  created_at: string
  total: number
  item_count: number
  items: OrderItem[]
  email: string
  phone: string
  fulfillment: 'pickup' | 'delivery'
  fulfillment_display: string
  address: string
  payment: 'card' | 'cash'
  payment_display: string
  gift_wrap: boolean
}

export interface CheckoutData {
  email: string
  phone: string
  fulfillment: 'pickup' | 'delivery'
  address: string
  payment: 'card' | 'cash'
  gift_wrap: boolean
}
