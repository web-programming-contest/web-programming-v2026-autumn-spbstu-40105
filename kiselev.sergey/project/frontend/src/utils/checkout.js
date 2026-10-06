import {REQUIRED_MESSAGE} from '../components/TextField.jsx';

export const DELIVERY_OPTIONS = [
  {value: 'pickup', label: 'Самовывоз'},
  {value: 'delivery', label: 'Доставка'},
];

export const PAYMENT_OPTIONS = [
  {value: 'card', label: 'По карте'},
  {value: 'cash', label: 'Наличными'},
];

export const INITIAL_CONTACT = {
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  payment: '',
  needPackaging: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidPhone(value) {
  if (!/^[\d\s()+-]+$/.test(value)) {
    return false;
  }

  const digits = value.replace(/\D/g, '');

  return digits.length === 11 && /^[78]/.test(digits);
}

export function validateContact(contact) {
  const errors = {};
  const phone = contact.phone.trim();
  const email = contact.email.trim();

  if (phone === '') {
    errors.phone = REQUIRED_MESSAGE;
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Введите номер в формате +7 900 000-00-00';
  }

  if (email !== '' && !EMAIL_PATTERN.test(email)) {
    errors.email = 'Введите корректный email';
  }

  if (contact.delivery === 'delivery' && contact.address.trim() === '') {
    errors.address = REQUIRED_MESSAGE;
  }

  if (contact.payment === '') {
    errors.payment = 'Выберите способ оплаты';
  }

  return errors;
}
