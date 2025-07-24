import React, { useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/legacy/image'
import Tooltip from '@mui/material/Tooltip';
import TimeAgo from 'timeago-react'
import type { Property } from 'csstype'
import type { MaintenanceResult, MaintenanceStatus } from '../lib/maintenance'
import { buildArgs, VercelEnv } from '../lib/environment'
import { BlogNoticeReusable } from './blog';

import in_progress from '../public/in_progress.svg'

const environmentName: 'Preview' | 'Production' = buildArgs.vercelEnv === 'production' ? 'Production' : 'Preview';

export function useMaintenanceInfo() {
  const { data, error } = useSWR<MaintenanceResult[]>('/api/maintenance');
  //const data: MaintenanceResult[] | undefined = [{"environment":"Preview","progress":{"status":"in_progress","conclusion":null,"started_at":"2023-02-21T09:39:21Z","completed_at":null,"steps":[{"number":8,"name":"Download latest public data bundle","status":"completed","conclusion":"success","started_at":"2023-02-21T03:39:37.000-06:00","completed_at":"2023-02-21T03:39:39.000-06:00"},{"number":9,"name":"Delete existing collections","status":"completed","conclusion":"success","started_at":"2023-02-21T03:39:40.000-06:00","completed_at":"2023-02-21T03:42:42.000-06:00"},{"number":10,"name":"Execute first phase of patchfiles","status":"in_progress","conclusion":null,"started_at":"2023-02-21T03:42:42.000-06:00","completed_at":null},{"number":11,"name":"Upload records from CSV data","status":"queued","conclusion":null,"started_at":null,"completed_at":null},{"number":12,"name":"Execute remaining patchfiles","status":"queued","conclusion":null,"started_at":null,"completed_at":null},{"number":23,"name":"Post Setup Node.js","status":"queued","conclusion":null,"started_at":null,"completed_at":null},{"number":24,"name":"Post Checkout code","status":"queued","conclusion":null,"started_at":null,"completed_at":null}]}},{"environment":"Production","progress":null}]

  return data?.find(info => info.environment === environmentName)
}

/**
 * https://primer.style/css/utilities/colors#background
 */
export const status2ClassName: Record<MaintenanceStatus, string> = {
  //'queued': 'color-bg-subtle',
  'queued': 'color-bg-maintenance-queued',
  //'in_progress': 'color-bg-attention-emphasis',
  'in_progress': '',
  'completed': 'color-bg-success-emphasis',
}

export function MaintenanceMonitor() {
  const data = useMaintenanceInfo()

  // useEffect(() => {
  //   console.log(data)
  // },[])

  const newLocal = '';
  // useEffect(() => {
  //   console.log('data', data)
  // }, [data])

  return (
    <>
    {
      data?.progress
      ? (
        <>
        <BlogNoticeReusable
          severity="warning"
          variant="standard"
          title={
            <span style={{ fontWeight: '600', fontSize: '1.1em' }}>CougarGrades is undergoing maintenance</span>
          }
          icon={
            <Image
              src={in_progress}
              width={30}
              height={30}
              layout="fixed"
              style={{ animation: 'rotate-keyframes 1s linear infinite' }}
              alt="In Progress"
            />
          } 
          action={typeof data.progress.html_url !== 'string' ? undefined : data.progress.html_url}
          time={new Date(data.progress.started_at)}>
            <p style={{ marginBottom: '1rem' }}>
              {/* Deploying to <strong>{environmentName}</strong> */}
              Our cloud-based database is getting refreshed.
              During this period, data on the site <strong>may be missing</strong> and some features <strong>may not work as expected</strong>.
            </p>
            <p>
              You can monitor the progress of the refresh with the progress bar below.
            </p>
            <span className="Progress" style={{ width: '100%', height: '12px', margin: '20px 0' }}>
              { data.progress.steps.map((step, index) => (
                <Tooltip key={step.number} placement="bottom" arrow title={
                  <>
                  {`${step.status === 'completed' ? '✅' : step.status === 'in_progress' ? '⏳' : '🕓'} ${step.name} (`}{
                    step.started_at !== null
                    ? (
                      step.duration_formatted !== null
                      ? (
                        <>lasted {step.duration_formatted}</>
                      )
                      : (
                        <>started <TimeAgo datetime={new Date(step.started_at)} /></>
                      )
                    )
                    : 'not started'
                  }{')'}
                  </>
                }>
                  {
                    <span className={`Progress-item ${status2ClassName[step.status]}`} style={{ flexGrow: 1, animation: step.status === 'in_progress' ? '1.5s ease-in-out 0.5s infinite normal none running in-progress-pulse' : undefined }}>{/* backgroundColor: status2Color[step.status] */}</span>
                  }
                </Tooltip>
              ))}
            </span>
        </BlogNoticeReusable>
        </>
      )
      : null
    }
    </>
  )
}