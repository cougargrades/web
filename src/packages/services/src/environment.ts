
import { z } from 'zod'
import { isNullishOrWhitespace } from '@cougargrades/utils/nullish'
import { is } from '@cougargrades/utils/zod';

//#region Cloudflare-specific

/**
 * When built by Cloudflare, this will be specified: https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
 * When built locally, it will be populated via: `$(git rev-parse --abbrev-ref HEAD)`
 * 
 * Ex: `next`
 */
const CF_PAGES_BRANCH = z.string().optional().parse(import.meta.env.VITE_CF_PAGES_BRANCH);

/**
 * When built by Cloudflare, this will be specified: https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
 * When built locally, it will be populated via: `$(git rev-parse HEAD)`
 * 
 * Ex: `f71a6dad94f6792a64fc9eb9d9ee728d48f2317c`
 */
const CF_PAGES_COMMIT_SHA = z.string().optional().parse(import.meta.env.VITE_CF_PAGES_COMMIT_SHA);

/**
 * When built by Cloudflare, this will be specified: https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
 * When built locally, it will be nothing.
 * 
 * Ex: https://feature-view-sparklines.web-22p.pages.dev/
 */
const CF_PAGES_URL = z.string().optional().parse(import.meta.env.VITE_CF_PAGES_URL);
const cfPreviewBranchPattern = new URLPattern(`https://:branch.:projectName.pages.dev/`);
const PREVIEW_BRANCH_NAME = cfPreviewBranchPattern.exec(CF_PAGES_URL)?.hostname.groups['branch'];


//#endregion

//#region Defined Properties

/**
 * The value of the `version` field in the top-level project's calling code
 */
export const VERSION = z.string().parse(import.meta.env.VITE_VERSION);
/**
 * When this build was made
 */
export const BUILD_DATE = z.coerce.date().parse(import.meta.env.VITE_BUILD_DATE);

const VITE_BRANCH_NAME = z.string().optional().parse(import.meta.env.VITE_BRANCH_NAME);
const VITE_COMMIT_SHA = z.string().optional().parse(import.meta.env.VITE_COMMIT_SHA);

export type BranchName = 'master' | 'next' | 'unknown' | (string & {});
export const BRANCH_NAME: BranchName = CF_PAGES_BRANCH ?? VITE_BRANCH_NAME ?? 'unknown';
export type CommitSha = 'unknown' | (string & {});
export const COMMIT_SHA: CommitSha = CF_PAGES_COMMIT_SHA ?? VITE_COMMIT_SHA ?? 'unknown';

//#endregion

//#region Interpreted Properties

export type EnvironmentName = z.infer<typeof EnvironmentName>
const EnvironmentName = z.enum(['production', 'preview', 'development'])
const PRODUCTION_BRANCH_NAME: BranchName = 'master';
const VITE_ENVIRONMENT_NAME = EnvironmentName.optional().parse(import.meta.env.VITE_ENVIRONMENT_NAME);

/**
 * This value is interpreted based on the values given
 */
export const ENVIRONMENT_NAME: EnvironmentName = (
  !isNullishOrWhitespace(VITE_ENVIRONMENT_NAME)
  ? VITE_ENVIRONMENT_NAME
  : (
    BRANCH_NAME === PRODUCTION_BRANCH_NAME
    ? 'production'
    : 'preview'
  )
);

const PREVIEW_API_BASE = `https://{0}-cougargrades-api.themacphage.workers.dev/`;
const DEFAULT_API_ORIGIN = new URL(`https://api.cougargrades.io`);
const VITE_API_ORIGIN = z.url().optional().parse(import.meta.env.VITE_API_ORIGIN);

/**
 * Considers:
 * - `VITE_API_ORIGIN` environment variable (optional)
 * - otherwise, DEFAULT_API_ORIGIN
 */
export const API_ORIGIN: URL = (
  // If "VITE_API_ORIGIN" is specified, always use it
  !isNullishOrWhitespace(VITE_API_ORIGIN)
  ? new URL(VITE_API_ORIGIN)
  // Otherwiose
  : (
    // If a "preview branch" is detected and it makes a valid URL, then try that!
    !isNullishOrWhitespace(PREVIEW_BRANCH_NAME) && is(PREVIEW_API_BASE.replace('{0}', PREVIEW_BRANCH_NAME), z.url())
    ? new URL(PREVIEW_API_BASE.replace('{0}', PREVIEW_BRANCH_NAME))
    : DEFAULT_API_ORIGIN
  )
);

//#endregion

