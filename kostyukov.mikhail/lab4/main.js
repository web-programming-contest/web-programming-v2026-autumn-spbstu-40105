import {Team} from './model.js';

const STORAGE_KEY = 'lab4_teams';

const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

function loadTeams() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return data.map((t) => new Team(t.name, t.members));
  } catch {
    return [];
  }
}

const teams = loadTeams();
const saveTeams = () =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));

const escape = (str) =>
  String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[
        s
      ],
  );

const entityForm = document.querySelector('[data-testid="entity-form"]');
const entityList = document.querySelector('[data-testid="entity-list"]');

function render() {
  if (teams.length === 0) {
    entityList.innerHTML =
      '<p class="empty-notice">Команд пока нет. Создайте первую!</p>';
    return;
  }

  entityList.innerHTML = teams
    .map(
      (team, index) => `
    <article class="entity-card" data-testid="entity-card">
      <div class="card-header">
        <h2 class="team-name">${escape(team.name)}</h2>
        <span class="team-count">Участников: ${team.memberCount}</span>
      </div>

      <button type="button" class="btn btn-danger" data-testid="delete-entity" data-team-index="${index}">
        Удалить команду
      </button>

      <div class="members-wrapper">
        <h3 class="members-title">Состав команды:</h3>
        <ul class="members-list">
          ${
            team.members.length === 0
              ? '<li class="member-item-empty">Нет участников</li>'
              : team.members
                  .map(
                    (m) => `
                <li class="member-item">
                  <span class="member-info">${escape(m.name)} (${escape(m.role)})</span>
                  <button type="button" class="btn-small-danger" data-action="delete-member" data-team-index="${index}" data-name="${escape(m.name)}">
                    Удалить
                  </button>
                </li>`,
                  )
                  .join('')
          }
        </ul>
      </div>

      <form class="member-form" data-team-index="${index}">
        <input type="text" name="name" class="form-input form-input-small" placeholder="Имя" required />
        <input type="text" name="role" class="form-input form-input-small" placeholder="Роль" required />
        <button type="submit" class="btn btn-secondary">Добавить участника</button>
      </form>
    </article>
  `,
    )
    .join('');
}

entityForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = entityForm.elements.name;
  const name = input.value.trim();
  if (!name) {
    return;
  }

  await wait();
  teams.push(new Team(name));
  saveTeams();
  entityForm.reset();
  render();
});

entityList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) {
    return;
  }

  const teamIndex = Number(btn.dataset.teamIndex);

  if (btn.matches('[data-testid="delete-entity"]')) {
    btn.disabled = true;
    await wait();
    teams.splice(teamIndex, 1);
    saveTeams();
    render();
  }

  if (btn.dataset.action === 'delete-member') {
    btn.disabled = true;
    await wait();
    teams[teamIndex].removeMember(btn.dataset.name);
    saveTeams();
    render();
  }
});

entityList.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const teamIndex = Number(form.dataset.teamIndex);
  const memberName = form.elements.name.value.trim();
  const memberRole = form.elements.role.value.trim();

  if (!memberName || !memberRole) {
    return;
  }

  if (teams[teamIndex].members.some((m) => m.name === memberName)) {
    alert('Участник с таким именем уже есть в команде');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
  }

  await wait();
  teams[teamIndex].addMember({name: memberName, role: memberRole});
  saveTeams();
  render();
});

render();
