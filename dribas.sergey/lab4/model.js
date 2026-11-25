export class Product {
  constructor(id, name, categories = [], price = 0) {
    this.id = id;
    this.name = name;
    this.categories = Array.isArray(categories) ? [...categories] : [];
    this.price = Number(price);
  }

  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category) {
    this.categories = this.categories.filter((c) => c !== category);
  }

  get categoryCount() {
    return this.categories.length;
  }
}

export function groupProductsByCategory(products) {
  const groups = {};
  for (const product of products) {
    for (const category of product.categories) {
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    }
  }
  return groups;
}

export function getUniqueCategories(products) {
  const unique = new Set();
  for (const product of products) {
    for (const category of product.categories) {
      unique.add(category);
    }
  }
  return [...unique];
}

export function groupProductsByPriceRange(products) {
  const step = 1000;
  const groups = {};
  for (const product of products) {
    const start = Math.floor(product.price / step) * step;
    const key = `${start}-${start + step}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(product);
  }
  return groups;
}

export function findProductsByCategory(products, category) {
  return products.filter((p) => p.categories.includes(category));
}

export function findProductsAbovePrice(products, minPrice) {
  return products.filter((p) => p.price > minPrice);
}
