export class Car {
  constructor(make, model, owners = []) {
    this.make = String(make ?? '').trim();
    this.model = String(model ?? '').trim();
    this.owners = Array.isArray(owners)
      ? owners.map((owner) => String(owner).trim()).filter(Boolean)
      : [];
  }

  addOwner(name) {
    const normalizedName = String(name ?? '').trim();
    if (!normalizedName || this.owners.includes(normalizedName)) {
      return false;
    }

    this.owners.push(normalizedName);
    return true;
  }

  removeOwner(name) {
    const normalizedName = String(name ?? '').trim();
    const prevLength = this.owners.length;
    this.owners = this.owners.filter((owner) => owner !== normalizedName);
    return this.owners.length !== prevLength;
  }

  get ownerCount() {
    return this.owners.length;
  }
}

export function groupCarsByMake(cars) {
  if (!Array.isArray(cars)) {
    return {};
  }

  return cars.reduce((groups, car) => {
    const key = car.make;
    if (!Object.hasOwn(groups, key)) {
      groups[key] = [];
    }
    groups[key].push(car);
    return groups;
  }, {});
}

export function getUniqueOwners(cars) {
  if (!Array.isArray(cars)) {
    return [];
  }

  const uniqueOwners = new Set();

  for (const car of cars) {
    if (Array.isArray(car.owners)) {
      for (const owner of car.owners) {
        uniqueOwners.add(owner);
      }
    }
  }

  return [...uniqueOwners];
}

function resolveOwnerCount(car) {
  if (typeof car.ownerCount === 'number') {
    return car.ownerCount;
  }
  return Array.isArray(car.owners) ? car.owners.length : 0;
}

export function groupCarsByOwnerCount(cars) {
  if (!Array.isArray(cars)) {
    return {};
  }

  return cars.reduce((groups, car) => {
    const count = resolveOwnerCount(car);
    if (!Object.hasOwn(groups, count)) {
      groups[count] = [];
    }
    groups[count].push(car);
    return groups;
  }, {});
}

export function findCarsByOwner(cars, ownerName) {
  if (!Array.isArray(cars)) {
    return [];
  }

  return cars.filter(
    (car) => Array.isArray(car.owners) && car.owners.includes(ownerName),
  );
}

export function findModelsByMake(cars, make) {
  if (!Array.isArray(cars)) {
    return [];
  }

  const models = new Set();

  for (const car of cars) {
    if (car.make === make) {
      models.add(car.model);
    }
  }

  return [...models];
}
