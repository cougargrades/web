
import { z } from 'zod'
import type { Octokit } from '@octokit/rest'
import { GitHubUser, ContributorsResponse } from '@cougargrades/models/dto'


// the org in question
const org = 'cougargrades';

// only check these repositories
const repository_whitelist = [
  { owner: 'cougargrades', name: 'web' },
  { owner: 'cougargrades', name: 'api' },
  { owner: 'cougargrades', name: 'types' },
  { owner: 'cougargrades', name: 'publicdata' },
  { owner: 'cougargrades', name: 'peoplesoft' },
  { owner: 'cougargrades', name: 'collegescheduler' },
];

// remove bots disguised as users
const user_id_blacklist = new Set<number>([
  { id: 31427850, login: 'ImgBotApp' }
].map(e => e.id))

export async function getContributors(octokit: Octokit): Promise<ContributorsResponse> {
  const public_member_ids = new Set<number>();

  // Get public members
  const public_members = (await octokit.orgs.listPublicMembers({ org }))
    .data
    // filter out bots
    .filter(e => e.type === 'User')
    .map<GitHubUser>(usr => ({
      id: usr.id,
      name: usr.name ?? usr.login,
      login: usr.login,
      html_url: usr.html_url,
      avatar_url: usr.avatar_url,
    }));

  for(let member of public_members) {
    public_member_ids.add(member.id);
  }

  const repo_contributors = await Promise.allSettled(repository_whitelist.map(async ({ owner, name }) => await octokit.repos.listContributors({ owner: owner, repo: name })))

  // Prevent duplicates
  const contributors = new Map<string, GitHubUser>();

  for(let usr of repo_contributors.map(r => r.status === 'fulfilled' ? r.value.data : []).flat()) {
    if (usr.type !== 'User') continue;
    if (user_id_blacklist.has(usr.id ?? 0)) {
      continue;
    }
    if (public_member_ids.has(usr.id ?? 0)) {
      continue;
    }
    contributors.set(usr.login ?? 'ghost', {
      id: usr.id ?? -1,
      name: usr.name ?? usr.login ?? 'ghost',
      login: usr.login ?? 'ghost',
      html_url: usr.html_url ?? `https://github.com/ghost`,
      avatar_url: usr.avatar_url ?? `https://avatars.githubusercontent.com/u/9919`
    })
  }

  return {
    public_members: public_members.toSorted((a, b) => a.id - b.id),
    contributors: Array.from(contributors.values()).toSorted((a, b) => a.id - b.id),
  }
}
