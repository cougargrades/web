
import { z } from 'zod'
import { CourseResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class CourseService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetCourse(courseName: string): Promise<CourseResult | null> {
    return await this.Get(`/api/course/${encodeURIComponent(courseName)}`, undefined, CourseResult)
  }
}

