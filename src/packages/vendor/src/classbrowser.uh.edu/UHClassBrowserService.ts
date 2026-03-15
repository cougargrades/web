

import { z } from 'zod'
import { BaseApiService } from './private/BaseApiService'
import { CourseInfo, ECareer, EInstructionMode, InstructionModeInfo, InstructorInfo, LiveSectionFilters, LiveSectionResponse, SubjectInfo, TermInfo } from './models'
import { isNullish } from '@cougargrades/utils/nullish'

export class UHClassBrowserService extends BaseApiService {
  constructor() {
    super()
  }

  public async GetAllTerms(): Promise<TermInfo[] | null> {
    return await this.Get(`/api/terms`, undefined, TermInfo.array())
  }

  public async GetAllSubjects(): Promise<SubjectInfo[] | null> {
    const schema = z.object({
      data: SubjectInfo.array()
    })
    return (await this.Get(`/api/subjects`, undefined, schema))?.data ?? null;
  }

  public async GetAllInstructionModes(args?: { term?: string, career?: ECareer }): Promise<InstructionModeInfo[] | null> {
    const schema = z.object({
      data: InstructionModeInfo.array()
    })
    return (await this.Get(`/api/online/career/modes`, args, schema))?.data ?? null;
  }

  /**
   * 
   * @param startsWith Must be at least 1 character in length
   * @returns 
   */
  public async SearchInstructors(startsWith: string): Promise<InstructorInfo[] | null> {
    const schema = z.object({
      data: InstructorInfo.array()
    })
    return (await this.Get(`/api/instructor`, { instructor: startsWith }, schema))?.data ?? null;
  }

  public async SearchCatalog(args?: { term?: string, subject?: string, mode?: EInstructionMode, career?: ECareer }): Promise<CourseInfo[] | null> {
    const schema = z.object({
      data: CourseInfo.array()
    })
    return (await this.Get(`/api/online/catalog`, args, schema))?.data ?? null;
  }

  public async SearchSections(args: Partial<LiveSectionFilters>): Promise<LiveSectionResponse | null> {
    let body = new URLSearchParams();
    for(let [k, v] of Object.entries(args)) {
      if (!isNullish(v)) {
        body.append(k, `${v}`);
      }
    }
    return await this.Post(`/api/courses`, undefined, LiveSectionResponse, { body: body });
  }
}


