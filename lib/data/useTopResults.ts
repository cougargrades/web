import React from 'react'
import useSWR from 'swr/immutable'
import { TopMetric, TopOptions } from '../../lib/top_front'
import { getRosetta, useRosetta } from '../i18n'
import { CoursePlusMetrics, InstructorPlusMetrics } from '../trending'
import { formatTermCode, getYear, seasonCode } from '../util'
import { Observable, ObservableStatus } from './Observable'
import { course2Result } from './useAllGroups'
import { CourseInstructorResult, instructor2Result } from './useCourseData'

export interface TopResult extends CourseInstructorResult {
  metricValue: number;
  metricFormatted: string;
  metricTimeSpanFormatted: string;
}

/**
 * This has nothing to do with the "metric" numbering system
 * https://en.wikipedia.org/wiki/Metric_system
 */
export function formatMetric(value: number, metric: TopMetric): string {
  const phrase = metric === 'totalEnrolled' ? 'enrolled' : 'views'
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K ${phrase}`
  }
  else {
    return `${value} ${phrase}`
  }
}

export function useTopResults({ metric, topic, limit, time }: TopOptions): Observable<TopResult[]> {
  const queryString = new URLSearchParams({ metric, topic, limit: `${limit}`, time })
  const { data, error, isLoading } = useSWR<(CoursePlusMetrics | InstructorPlusMetrics)[]>(`/api/top?${queryString}`);
  const status: ObservableStatus = error ? 'error' : (isLoading || !data) ? 'loading' : 'success'

  const get_value = (e: CoursePlusMetrics | InstructorPlusMetrics) => 
    metric === 'totalEnrolled' 
    ? (e.enrollment?.totalEnrolled ?? 0)
    : metric === 'activeUsers' ? (e.activeUsers ?? 0) : (e.screenPageViews ?? 0);

  return {
    data: [
      ...(status === 'success' ? data!.map<TopResult>(e => ({
        // set the "caption" to an empty string
        ...('catalogNumber' in e ? ({...course2Result(e), caption: ''}) : ({...instructor2Result(e), caption: ''})),
        metricValue: get_value(e),
        metricFormatted: formatMetric(get_value(e), metric),
        //metricTimeSpanFormatted: `${getYear(e.firstTaught)}`,
        metricTimeSpanFormatted: formatTermCode(e.firstTaught),
      })) : [])
    ],
    status,
    error,
  }
}

