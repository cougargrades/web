import { env } from 'cloudflare:workers'
import { octokit as _octokit } from '@cougargrades/vendor/github'

export const octokit = () => {
  return _octokit(env.GITHUB_ACCESS_TOKEN);
}
