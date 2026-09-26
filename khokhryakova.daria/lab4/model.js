export class Restaurant {
  constructor(name, menu = []) {
    this.name = name;
    this.menu = menu;
  }

  get menuSize() {
    return this.menu.length;
  }

  addDish(dish) {
    this.menu.push(dish);
  }

  removeDish(dishName) {
    this.menu = this.menu.filter((dish) => dish.name !== dishName);
  }
}

export function groupRestaurantsByMenuSize(restaurants) {
  const groups = new Map();

  for (const restaurant of restaurants) {
    const size = restaurant.menu.length;

    if (!groups.has(size)) {
      groups.set(size, []);
    }

    groups.get(size).push(restaurant);
  }

  return groups;
}

export function getUniqueDishes(restaurants) {
  const names = new Set();
  for (const restaurant of restaurants) {
    for (const dish of restaurant.menu) {
      names.add(dish.name);
    }
  }
  return Array.from(names);
}

export function findRestaurantsByDish(restaurants, dishName) {
  return restaurants.filter((restaurant) =>
    restaurant.menu.some((dish) => dish.name === dishName),
  );
}

export function groupDishesByPriceRange(restaurants) {
  const result = {
    cheap: [],
    medium: [],
    expensive: [],
  };

  for (const restaurant of restaurants) {
    for (const dish of restaurant.menu) {
      if (dish.price < 500) {
        result.cheap.push(dish);
      } else if (dish.price <= 1000) {
        result.medium.push(dish);
      } else {
        result.expensive.push(dish);
      }
    }
  }
  return result;
}

export function findRestaurantsWithMostExpensiveDish(restaurants) {
  let maxPrice = -Infinity;
  for (const restaurant of restaurants) {
    for (const dish of restaurant.menu) {
      if (dish.price > maxPrice) {
        maxPrice = dish.price;
      }
    }
  }

  return restaurants.filter((restaurant) =>
    restaurant.menu.some((dish) => dish.price === maxPrice),
  );
}
