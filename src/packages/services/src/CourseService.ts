
import { z } from 'zod'
import { Course } from '@cougargrades/models'
import { DocumentReferenceService } from './DocumentReferenceService'

export class CourseService extends DocumentReferenceService {
  constructor() {
    super()
  }

  public async GetCourse(courseName: string): Promise<Course | null> {
    return await this.GetDocumentByPath(`/catalog/${courseName}`, Course);
  }
}

