
import { z } from 'zod'
import { InstructorResult } from '@cougargrades/models/dto'
import { BaseApiService } from './private/BaseApiService'

export class InstructorService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetInstructor(instructorName: string): Promise<InstructorResult | null> {
    return await this.Get(`/api/instructor/${encodeURIComponent(instructorName.toLowerCase())}`, undefined, InstructorResult)
  }
}

