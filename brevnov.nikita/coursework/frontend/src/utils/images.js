// Данные с бэкенда хранят только имя файла картинки товара (например
// "image_1.png"), а не путь — так JSON остаётся независимым от структуры
// фронтенда. import.meta.glob подхватывает все картинки один раз при сборке
// и по этому имени отдаёт готовый URL (Vite сам оптимизирует и хэширует файл).
const goodImages = import.meta.glob('../assets/images/goods/*.png', {
  eager: true,
  import: 'default',
});

export function getGoodImageUrl(filename) {
  return goodImages[`../assets/images/goods/${filename}`] ?? null;
}
