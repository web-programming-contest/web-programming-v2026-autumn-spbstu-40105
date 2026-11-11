/**
 * Форматирует строку из десяти цифр без кода страны.
 * @param {string} phoneStr Номер телефона, например '9991234567'.
 * @returns {string} Номер в формате +7 (XXX) XXX-XX-XX.
 */
export function formatPhoneNumber(phoneStr) {
  if (typeof phoneStr !== 'string') {
    throw new TypeError('Номер телефона должен быть строкой.');
  }

  if (!/^[0-9]{10}$/.test(phoneStr)) {
    throw new RangeError('Номер телефона должен содержать ровно 10 цифр.');
  }

  return `+7 (${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6, 8)}-${phoneStr.slice(8, 10)}`;
}
