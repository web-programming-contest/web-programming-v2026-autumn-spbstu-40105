// Модель не зависит от DOM и localStorage.
export class Movie {
  constructor(title, director, actors = []) {
    this.title = title;
    this.director = director;
    this.actors = [...actors];
  }

  addActor(name) {
    this.actors.push(name);
  }

  removeActor(name) {
    this.actors = this.actors.filter((actor) => actor !== name);
  }

  get castSize() {
    return this.actors.length;
  }
}

function groupBy(movies, getKey) {
  const groups = new Map();
  for (const movie of movies) {
    const key = getKey(movie);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(movie);
  }
  return groups;
}

export function groupMoviesByDirector(movies) {
  return groupBy(movies, (movie) => movie.director);
}

export function getUniqueActors(movies) {
  return [...new Set(movies.flatMap((movie) => movie.actors))];
}

export function groupMoviesByCastSize(movies) {
  return groupBy(movies, (movie) => movie.actors.length);
}

export function findMoviesByActor(movies, actor) {
  return movies.filter((movie) => movie.actors.includes(actor));
}

export function getMovieTitles(movies) {
  return movies.map((movie) => movie.title);
}
