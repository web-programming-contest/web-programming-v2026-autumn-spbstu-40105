export class Team {
  constructor(name = '', members = []) {
    this.name = String(name);
    this.members = Array.isArray(members) ? [...members] : [];
  }

  addMember(member, role = '') {
    this.members.push(
      typeof member === 'object' ? member : {name: member, role},
    );
  }

  removeMember(name) {
    const targetName =
      typeof name === 'object' && name !== null ? name.name : name;
    this.members = this.members.filter((member) => member.name !== targetName);
  }

  get memberCount() {
    return this.members.length;
  }
}

export function groupMembersByRole(teams) {
  const result = {};
  if (!Array.isArray(teams)) {
    return result;
  }

  for (const team of teams) {
    if (!team || !Array.isArray(team.members)) {
      continue;
    }
    for (const member of team.members) {
      if (!member || typeof member.role !== 'string') {
        continue;
      }
      if (!result[member.role]) {
        result[member.role] = [];
      }
      result[member.role].push(member);
    }
  }

  return result;
}

export function getUniqueRoles(teams) {
  const roles = new Set();
  if (!Array.isArray(teams)) {
    return [];
  }

  for (const team of teams) {
    if (!team || !Array.isArray(team.members)) {
      continue;
    }
    for (const member of team.members) {
      if (member && typeof member.role === 'string') {
        roles.add(member.role);
      }
    }
  }

  return Array.from(roles);
}

export function groupTeamsByMemberCount(teams) {
  const result = new Map();
  if (!Array.isArray(teams)) {
    return result;
  }

  for (const team of teams) {
    if (!team) {
      continue;
    }
    const count = team.memberCount ?? team.members?.length ?? 0;
    const list = result.get(count) || [];
    list.push(team);

    result.set(count, list);
    result[count] = list;
  }

  return result;
}

export function findTeamsByMember(teams, name) {
  if (!Array.isArray(teams)) {
    return [];
  }

  return teams.filter(
    (team) =>
      team &&
      Array.isArray(team.members) &&
      team.members.some((member) => member && member.name === name),
  );
}

export function getUniqueMembers(teams) {
  if (!Array.isArray(teams)) {
    return [];
  }

  const seen = new Set();
  const result = [];

  for (const team of teams) {
    if (!team || !Array.isArray(team.members)) {
      continue;
    }
    for (const member of team.members) {
      if (!member || typeof member.name !== 'string') {
        continue;
      }
      if (!seen.has(member.name)) {
        seen.add(member.name);
        result.push(member);
      }
    }
  }

  return result;
}
