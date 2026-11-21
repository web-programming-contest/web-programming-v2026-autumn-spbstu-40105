# Лабораторная работа 4

## Задание

Вариант 34.

1. Создать класс `Car` с полями `make`, `model`, `owners`, методами
   `addOwner(name)`, `removeOwner(name)` и геттером `ownerCount`.
2. Реализовать функции работы с массивом автомобилей: `groupCarsByMake`,
   `getUniqueOwners`, `groupCarsByOwnerCount`, `getCarsByOwner`,
   `getModelsByMake`.
3. Реализовать интерактивный пользовательский интерфейс: карточки автомобилей с
   управлением владельцами, формы добавления автомобиля и владельца, кнопки
   добавления/удаления, автоматическое обновление UI, асинхронные операции через
   `Promise` + `setTimeout()` и сохранение состояния в `localStorage` по ключу
   `cars`.

## Реализация

- **`model.js`**: экспортируются класс `Car` и чистые функции `groupCarsByMake`,
  `getUniqueOwners`, `groupCarsByOwnerCount`, `findCarsByOwner`,
  `findModelsByMake` (с `Set` и `Object.hasOwn` для безопасной работы с
  коллекциями).
- **`main.js`**: управление состоянием через `localStorage` (ключ `cars`) с
  восстановлением экземпляров `Car`, асинхронная обёртка `runAsync` на базе
  `Promise` + `setTimeout()` и безопасный рендер DOM через `createElement` /
  `textContent`.
- **`index.html` и `styles.css`**: форма `entity-form` (`make`, `model`),
  контейнер `entity-list` с карточками автомобилей, вложенными формами
  добавления владельцев и сводкой по коллекции.

## Запуск

Откройте `index.html` через локальный HTTP-сервер.
