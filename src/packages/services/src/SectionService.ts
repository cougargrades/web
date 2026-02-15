
import { z } from 'zod'
import { Section } from '@cougargrades/models'
import { DocumentReferenceService } from './DocumentReferenceService'

export class SectionService extends DocumentReferenceService {
  constructor() {
    super()
  }

  public async GetSection(sectionID: string): Promise<Section | null> {
    return await this.GetDocumentByPath(`/sections/${sectionID}`, Section);
  }
}

