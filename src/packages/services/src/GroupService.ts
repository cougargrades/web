
import { z } from 'zod'
import { Group } from '@cougargrades/models'
import { DocumentReferenceService } from './DocumentReferenceService'

export class GroupService extends DocumentReferenceService {
  constructor() {
    super()
  }

  public async GetGroup(groupId: string): Promise<Group | null> {
    return await this.GetDocumentByPath(`/groups/${groupId}`, Group);
  }
}

