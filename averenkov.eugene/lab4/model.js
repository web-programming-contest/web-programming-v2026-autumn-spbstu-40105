export class Movie {
  constructor(title, director, actors = []) {
    this.title = title;
    this.director = director;
    this.actors = actors;
  }

  addActor(name) {
    this.actors.push(name);
  }

  removeActor(name) {
    const index = this.actors.indexOf(name);
    if (index !== -1) {
      this.actors.splice(index, 1);
    }
  }

  get castSize() {
    return this.actors.length;
  }
}

export function groupMoviesByDirector(movies) {
  const result = {};
  for (const movie of movies) {
    if (!result[movie.director]) {
      result[movie.director] = [];
    }
    result[movie.director].push(movie);
  }
  return result;
}

export function getUniqueActors(movies) {
  const set = new Set();
  for (const movie of movies) {
    for (const actor of movie.actors) {
      set.add(actor);
    }
  }
  return [...set];
}

export function groupMoviesByCastSize(movies) {
  const groups = new Map();

  for (const movie of movies) {
    const size = movie.castSize;

    if (!groups.has(size)) {
      groups.set(size, []);
    }

    groups.get(size).push(movie);
  }

  return groups;
}

export function findMoviesByActor(movies, actorName) {
  return movies.filter((movie) => movie.actors.includes(actorName));
}

export function getMovieTitles(movies) {
  return movies.map((movie) => movie.title);
}
