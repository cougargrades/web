
import { z } from 'zod'
import { Instructor } from '@cougargrades/models'
import { DocumentReferenceService } from './DocumentReferenceService'

export class InstructorService extends DocumentReferenceService {
  constructor() {
    super()
  }

  public async GetInstructor(instructorName: string): Promise<Instructor | null> {
    return await this.GetDocumentByPath(`/instructors/${instructorName}`, Instructor);
  }
}

