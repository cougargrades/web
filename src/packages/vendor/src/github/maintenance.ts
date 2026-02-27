
import { z } from 'zod'
import { Octokit } from '@octokit/rest'
import { Temporal } from 'temporal-polyfill'

export type MaintenanceStatus = z.infer<typeof MaintenanceStatus>;
export const MaintenanceStatus = z.enum(['queued', 'in_progress', 'completed'])

export type MaintenanceStep = z.infer<typeof MaintenanceStep>
export const MaintenanceStep = z.object({
  number: z.number(),
  name: z.string(),
  status: MaintenanceStatus,
  conclusion: z.string().nullable(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  //duration_formatted: z.string().nullable(),
  duration_iso: z.iso.duration().nullable(),
})

export type MaintenanceProgress = z.infer<typeof MaintenanceProgress>
export const MaintenanceProgress = z.object({
  status: MaintenanceStatus,
  conclusion: z.string().nullable(),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  html_url: z.string().nullable(),
  steps: MaintenanceStep.array(),
})

export type MaintenanceResult = z.infer<typeof MaintenanceResult>
export const MaintenanceResult = z.object({
  environment: z.string(),
  progress: MaintenanceProgress.nullable(),
})

export async function test(githubAccessToken: string) {
  const octokit = new Octokit({
    auth: githubAccessToken,
  });

  const data = await octokit.rateLimit.get()
  return data;
} 

export async function getDeploymentInfo(githubAccessToken: string): Promise<MaintenanceResult[]> {
  // These are the starter objects for what we will be returning
  const previewResult: MaintenanceResult = {
    environment: 'Preview',
    progress: null,
  }
  const productionResult: MaintenanceResult = {
    environment: 'Production',
    progress: null,
  }

  const octokit = new Octokit({
    //auth: process.env.GITHUB_ACCESS_TOKEN
    auth: githubAccessToken,
  });

  const owner = 'cougargrades'
  const repo = 'deployment'

  // We need to get a list of workflows
  const { data: { workflows } } = await octokit.rest.actions.listRepoWorkflows({
    owner,
    repo,
  })

  // Identify the correct one and save the ID
  const workflow_id = workflows.find(work => work.path === '.github/workflows/deployment.yml')?.id

  // Double check that we found the intended workflow
  if (workflow_id) {
    const { data: { workflow_runs }} = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id,
    })

    //console.log(workflow_runs)

    // We're interested in runs that are `in_progress` or `queued`
    for(let run of workflow_runs.filter(run => ['queued', 'in_progress'].includes(run.status ?? ''))) {
      // We're going to need to see the jobs running to identify which Environment to associate it with
      //console.log(`run_id: ${run.id}, created_at: ${new Date(run.created_at).toLocaleString()}, status: ${run.status}, conclusion: ${run.conclusion}`)
      const { data: { jobs } } = await octokit.rest.actions.listJobsForWorkflowRun({
        owner,
        repo,
        run_id: run.id
      })
      
      // We have access to the steps now
      if(jobs.length > 0 && jobs[0].steps) {
        const job = jobs[0]
        const steps = jobs[0].steps

        const PREVIEW_SENTINEL = `We're running in the Preview Environment`;
        const PRODUCTION_SENTINEL = `We're running in the Production Environment`;
        
        const FIRST_STEP_SENTINEL = `Test Firebase access`
        const LAST_STEP_SENTINEL = `Post Setup Node.js`

        // const firstRelevantStepIndex = steps.findIndex(step => step.name === FIRST_STEP_SENTINEL)
        // const lastRelevantStepIndex = steps.findIndex(step => step.name === LAST_STEP_SENTINEL)
        const firstRelevantStepIndex = 0
        const lastRelevantStepIndex = steps.length - 1;

        // create a "Progress" object for this job
        const progress: MaintenanceProgress = {
          status: job.status,
          conclusion: job.conclusion,
          started_at: job.started_at,
          completed_at: job.completed_at,
          html_url: job.html_url,
          steps: steps.slice(firstRelevantStepIndex+1, lastRelevantStepIndex).map(step => ({
            number: step.number,
            name: step.name,
            status: step.status,
            conclusion: step.conclusion,
            started_at: step.started_at === undefined ? null : step.started_at,
            completed_at: step.completed_at === undefined ? null : step.completed_at,
            duration_iso: (
              typeof step.started_at === 'string' && typeof step.completed_at === 'string'
              ? Temporal.Instant.from(step.started_at).since(Temporal.Instant.from(step.completed_at)).abs().toJSON()
              : null
            )
            // duration_formatted: (
            //   typeof step.started_at === 'string' && typeof step.completed_at === 'string'
            //   ? formatDuration(Math.abs(new Date(step.started_at).valueOf() - new Date(step.completed_at).valueOf()))
            //   : null
            // ),
            //duration_formatted: null,
          })),
        }

        // This workflow run is associated with the Preview Environment
        if (steps.find(step => step.name === PREVIEW_SENTINEL)?.conclusion !== 'skipped') {
          previewResult.progress = progress
        }
        // This workflow run is associated with the Production Environment
        else if (steps.find(step => step.name === PRODUCTION_SENTINEL)?.conclusion !== 'skipped') {
          productionResult.progress = progress
        }
      }
    }
  }

  return [previewResult, productionResult]
}


