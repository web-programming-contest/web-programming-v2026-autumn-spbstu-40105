import {Movie} from './model.js';

const STORAGE_KEY = 'movies';

let movies = [];

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  const parsed = JSON.parse(saved);
  movies = parsed.map((m) => new Movie(m.title, m.director, m.actors));
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

function render() {
  const list = document.querySelector('[data-testid="entity-list"]');
  list.innerHTML = '';

  for (const movie of movies) {
    list.appendChild(createMovieCard(movie));
  }
}

function createMovieCard(movie) {
  const card = document.createElement('article');
  card.dataset.testid = 'entity-card';

  card.innerHTML = `
    <h3>${movie.title}</h3>
    <p>Режиссёр: ${movie.director}</p>
    <p>Актёры: ${movie.actors.join(', ')}</p>
  `;

  const removeMovieBtn = document.createElement('button');
  removeMovieBtn.type = 'button';
  removeMovieBtn.dataset.testid = 'delete-entity';
  removeMovieBtn.textContent = 'Удалить фильм';
  removeMovieBtn.onclick = function () {
    removeMovie(movie.title);
  };
  card.appendChild(removeMovieBtn);

  const actorInput = document.createElement('input');
  actorInput.type = 'text';
  actorInput.placeholder = 'Имя актёра';

  const addActorBtn = document.createElement('button');
  addActorBtn.type = 'button';
  addActorBtn.textContent = 'Добавить актёра';
  addActorBtn.onclick = function () {
    if (actorInput.value.trim() !== '') {
      addActor(movie.title, actorInput.value.trim());
    }
  };

  const removeActorBtn = document.createElement('button');
  removeActorBtn.type = 'button';
  removeActorBtn.textContent = 'Удалить актёра';
  removeActorBtn.onclick = function () {
    if (actorInput.value.trim() !== '') {
      removeActor(movie.title, actorInput.value.trim());
    }
  };

  card.appendChild(actorInput);
  card.appendChild(addActorBtn);
  card.appendChild(removeActorBtn);

  return card;
}

function addMovie(title, director) {
  return new Promise((resolve) => {
    setTimeout(() => {
      movies.push(new Movie(title, director, []));
      save();
      render();
      resolve();
    }, 300);
  });
}

function removeMovie(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      movies = movies.filter((m) => m.title !== title);
      save();
      render();
      resolve();
    }, 300);
  });
}

function addActor(title, actorName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movie = movies.find((m) => m.title === title);
      movie.addActor(actorName);
      save();
      render();
      resolve();
    }, 300);
  });
}

function removeActor(title, actorName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movie = movies.find((m) => m.title === title);
      movie.removeActor(actorName);
      save();
      render();
      resolve();
    }, 300);
  });
}

const form = document.querySelector('[data-testid="entity-form"]');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = e.target.elements.title.value.trim();
  const director = e.target.elements.director.value.trim();

  if (title === '' || director === '') {
    return;
  }

  addMovie(title, director);
  e.target.reset();
});

window.addEventListener('beforeunload', save);

render();
