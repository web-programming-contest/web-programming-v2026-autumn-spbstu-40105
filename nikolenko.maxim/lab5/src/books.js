import annaKarenina from '../assets/anna-karenina.webp';
import crimeAndPunishment from '../assets/crime-and-punishment.webp';
import deadSouls from '../assets/dead-souls.webp';
import eugeneOnegin from '../assets/eugene-onegin.webp';
import fathersAndSons from '../assets/fathers-and-sons.webp';
import heroOfOurTime from '../assets/hero-of-our-time.webp';
import masterAndMargarita from '../assets/master-and-margarita.webp';
import warAndPeace from '../assets/war-and-peace.webp';

export const BOOKS = [
  {
    id: 1,
    title: 'Война и мир',
    author: 'Л. Толстой',
    cover: warAndPeace,
    rating: 4.8,
    price: 1290,
    description:
      'Роман-эпопея о судьбах нескольких семей на фоне войны 1812 года и о том, как большая история меняет частную жизнь.',
  },
  {
    id: 2,
    title: 'Мастер и Маргарита',
    author: 'М. Булгаков',
    cover: masterAndMargarita,
    rating: 4.9,
    price: 690,
    description:
      'Москва тридцатых, визит Воланда со свитой и история любви, в которой фантасмагория соседствует с сатирой.',
  },
  {
    id: 3,
    title: 'Преступление и наказание',
    author: 'Ф. Достоевский',
    cover: crimeAndPunishment,
    rating: 4.7,
    price: 540,
    description:
      'Бедный студент Раскольников решается на убийство и оказывается один на один со своей совестью.',
  },
  {
    id: 4,
    title: 'Евгений Онегин',
    author: 'А. Пушкин',
    cover: eugeneOnegin,
    rating: 4.5,
    price: 380,
    description:
      'Роман в стихах о скучающем столичном дворянине, неразделённой любви и запоздалом раскаянии.',
  },
  {
    id: 5,
    title: 'Мёртвые души',
    author: 'Н. Гоголь',
    cover: deadSouls,
    rating: 4.4,
    price: 460,
    description:
      'Чичиков разъезжает по губернии и скупает «мёртвые души», а читатель знакомится с галереей помещиков.',
  },
  {
    id: 6,
    title: 'Анна Каренина',
    author: 'Л. Толстой',
    cover: annaKarenina,
    rating: 4.6,
    price: 820,
    description:
      'Две сюжетные линии: трагедия замужней женщины, полюбившей другого, и поиски смысла жизни помещиком Левиным.',
  },
  {
    id: 7,
    title: 'Отцы и дети',
    author: 'И. Тургенев',
    cover: fathersAndSons,
    rating: 4.3,
    price: 350,
    description:
      'Конфликт поколений и взглядов: нигилист Базаров приезжает в усадьбу и сталкивается с привычным укладом.',
  },
  {
    id: 8,
    title: 'Герой нашего времени',
    author: 'М. Лермонтов',
    cover: heroOfOurTime,
    rating: 4.5,
    price: 320,
    description:
      'Пять повестей о Печорине, умном и разочарованном офицере, который никак не находит себе места.',
  },
];
