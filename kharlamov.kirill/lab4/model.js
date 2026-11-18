export class ClothingItem {
  constructor(id, name, size, colors = []) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.colors = [...new Set(colors)];
  }

  addColor(color) {
    if (!this.colors.includes(color)) {
      this.colors.push(color);
    }
  }

  removeColor(color) {
    this.colors = this.colors.filter((value) => value !== color);
  }

  get colorsCount() {
    return this.colors.length;
  }
}

function groupItems(items, getKey) {
  const groups = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }
  return groups;
}

export function groupItemsBySize(items) {
  return groupItems(items, (item) => item.size);
}

export function getUniqueColors(items) {
  return [...new Set(items.flatMap((item) => item.colors))];
}

export function findItemsByColor(items, color) {
  return items.filter((item) => item.colors.includes(color));
}

export function groupItemsByColorCount(items) {
  return groupItems(items, (item) => item.colors.length);
}

export function findItemsAboveColorCount(items, count) {
  return items.filter((item) => item.colors.length > count);
}
