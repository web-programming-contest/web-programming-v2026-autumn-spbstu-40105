import {Team} from './model.js';

const STORAGE_KEY = 'teams';
const DELAY_MS = 300;

const list = document.querySelector('[data-testid="entity-list"]');
const teamForm = document.querySelector('form[data-testid="entity-form"]');

let teams = loadTeams();

function loadTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw).map((item) => new Team(item.name, item.members));
  } catch {
    return [];
  }
}

function saveTeams() {
  try {
    const data = teams.map((team) => ({
      name: team.name,
      members: team.members,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Хранилище недоступно: приложение продолжает работать без сохранения.
  }
}

// Любая операция выполняется асинхронно: Promise + setTimeout.
function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      resolve();
    }, DELAY_MS);
  });
}

function commit() {
  saveTeams();
  render();
}

function addTeam(name) {
  return runAsync(() => {
    teams.push(new Team(name));
    commit();
  });
}

function removeTeam(team) {
  return runAsync(() => {
    teams = teams.filter((item) => item !== team);
    commit();
  });
}

function addMember(team, member) {
  return runAsync(() => {
    team.addMember(member);
    commit();
  });
}

function removeMember(team, name) {
  return runAsync(() => {
    team.removeMember(name);
    commit();
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createField(labelText, name) {
  const label = createElement('label', 'field');
  const span = createElement('span', 'field-label', labelText);
  const input = createElement('input', 'field-input');

  input.type = 'text';
  input.name = name;
  input.required = true;
  input.autocomplete = 'off';
  label.append(span, input);

  return label;
}

function createMemberForm(team) {
  const form = createElement('form', 'member-form');

  form.dataset.testid = 'member-form';
  form.append(createField('Имя', 'name'), createField('Роль', 'role'));

  const submit = createElement(
    'button',
    'button button-primary',
    'Добавить участника',
  );

  submit.type = 'submit';
  form.append(submit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const role = String(data.get('role')).trim();

    if (!name || !role) {
      return;
    }

    form.reset();
    addMember(team, {name, role});
  });

  return form;
}

function createMemberItem(team, member) {
  const item = createElement('li', 'member-item');
  const text = createElement(
    'span',
    'member-text',
    `${member.name} — ${member.role}`,
  );
  const button = createElement('button', 'button button-danger', 'Удалить');

  button.type = 'button';
  button.dataset.testid = 'delete-member';
  button.addEventListener('click', () => {
    removeMember(team, member.name);
  });
  item.append(text, button);

  return item;
}

function createCard(team) {
  const card = createElement('article', 'team-card');

  card.dataset.testid = 'entity-card';

  const header = createElement('div', 'team-header');
  const title = createElement('h2', 'team-title', team.name);
  const deleteButton = createElement(
    'button',
    'button button-danger',
    'Удалить команду',
  );

  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.addEventListener('click', () => {
    removeTeam(team);
  });
  header.append(title, deleteButton);

  const count = createElement(
    'p',
    'team-count',
    `Участников: ${team.memberCount}`,
  );
  const members = createElement('ul', 'member-list');

  for (const member of team.members) {
    members.append(createMemberItem(team, member));
  }

  card.append(header, count, members, createMemberForm(team));

  return card;
}

function render() {
  list.replaceChildren(...teams.map(createCard));
}

teamForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = String(new FormData(teamForm).get('name')).trim();

  if (!name) {
    return;
  }

  teamForm.reset();
  addTeam(name);
});

render();
