export class Team {
  constructor(name, members = []) {
    this.name = name;
    this.members = members.map((member) => ({
      name: member.name,
      role: member.role,
    }));
  }

  addMember(member) {
    this.members.push({name: member.name, role: member.role});
  }

  removeMember(name) {
    const index = this.members.findIndex((member) => member.name === name);

    if (index !== -1) {
      this.members.splice(index, 1);
    }
  }

  get memberCount() {
    return this.members.length;
  }
}

// Участники всех команд, сгруппированные по ролям: {роль: [участники]}.
export function groupMembersByRole(teams) {
  const groups = {};

  for (const team of teams) {
    for (const member of team.members) {
      if (!groups[member.role]) {
        groups[member.role] = [];
      }
      groups[member.role].push({name: member.name, role: member.role});
    }
  }

  return groups;
}

// Уникальные роли.
export function getUniqueRoles(teams) {
  const roles = new Set();

  for (const team of teams) {
    for (const member of team.members) {
      roles.add(member.role);
    }
  }

  return [...roles];
}

// Команды, сгруппированные по количеству участников: {количество: [команды]}.
export function groupTeamsByMemberCount(teams) {
  const groups = {};

  for (const team of teams) {
    const count = team.memberCount;

    if (!groups[count]) {
      groups[count] = [];
    }
    groups[count].push(team);
  }

  return groups;
}

// Команды, в которых есть участник с заданным именем.
export function findTeamsByMemberName(teams, name) {
  return teams.filter((team) =>
    team.members.some((member) => member.name === name),
  );
}

// Все участники без повторов (одинаковые имя и роль считаются одним участником).
export function getUniqueMembers(teams) {
  const seen = new Set();
  const result = [];

  for (const team of teams) {
    for (const member of team.members) {
      const key = `${member.name}\u0000${member.role}`;

      if (!seen.has(key)) {
        seen.add(key);
        result.push({name: member.name, role: member.role});
      }
    }
  }

  return result;
}
