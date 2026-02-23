
import { z } from 'zod'
import { CoursePlusMetrics, InstructorPlusMetrics, SearchResult, TopOptions } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

type CourseOrInstructorPlusMetrics = z.infer<typeof CourseOrInstructorPlusMetrics>
const CourseOrInstructorPlusMetrics = CoursePlusMetrics.or(InstructorPlusMetrics);

export class TopService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetTopResults({ metric, topic, limit, time, hideCore }: TopOptions): Promise<CourseOrInstructorPlusMetrics[]> {
    return await this.Get(`/api/top`, { metric, topic, limit: limit.toString(), time, hideCore: `${hideCore}` }, CourseOrInstructorPlusMetrics.array()) ?? [];
  }
}

