
import { z } from 'zod'
import { Octokit } from '@octokit/rest'

export function octokit(githubAccessToken: string) {
  const octokit = new Octokit({
    auth: githubAccessToken,
  });
  return octokit;
}

