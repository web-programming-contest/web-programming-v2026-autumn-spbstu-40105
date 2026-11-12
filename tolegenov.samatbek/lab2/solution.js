// Экспортируйте отсюда функцию с именем из контракта вашего варианта.
export function formatPhoneNumber(phoneStr) {
  let digits = String(phoneStr).replace(/\D/g, '');

  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    throw new Error('Некорректный номер телефона');
  }

  return digits.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
}
