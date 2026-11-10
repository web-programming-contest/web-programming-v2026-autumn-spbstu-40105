export const catalog = [
  {
    id: 'author-dostoevsky',
    title: 'Фёдор Достоевский',
    children: [
      {
        id: 'publisher-eksmo',
        title: 'Эксмо',
        children: [
          {
            id: 'genre-novel',
            title: 'Роман',
            children: [
              {id: 'book-crime', title: 'Преступление и наказание'},
              {id: 'book-idiot', title: 'Идиот'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'author-tolstoy',
    title: 'Лев Толстой',
    children: [
      {
        id: 'publisher-azbuka',
        title: 'Азбука',
        children: [
          {
            id: 'genre-epic',
            title: 'Роман-эпопея',
            children: [{id: 'book-war', title: 'Война и мир'}],
          },
          {
            id: 'genre-drama',
            title: 'Драма',
            children: [{id: 'book-anna', title: 'Анна Каренина'}],
          },
        ],
      },
    ],
  },
];
