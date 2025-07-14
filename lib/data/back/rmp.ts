
import { z } from 'zod/v4'
import { searchProfessorsAtSchoolId } from 'api-rmp'
import { UH_RMP_SCHOOL_IDS } from '../rmp'

export const RMPSearchResult = z.object({
    id: z.string(),
    legacyId: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    department: z.string(),
    avgRating: z.number(),
    numRatings: z.number(),
    school: z.object({
        id: z.string(),
        name: z.string(),
    })
})
export type RMPSearchResult = z.infer<typeof RMPSearchResult>
export type RMPRankedSearchResult = RMPSearchResult & {
    _searchScore: number;
};

export async function search(filter: string): Promise<RMPSearchResult[]> {
    // Search all different campuses concurrently
    const settledData = await Promise.allSettled(UH_RMP_SCHOOL_IDS.map(schoolID => searchProfessorsAtSchoolId(filter, schoolID)));
    const result: RMPSearchResult[] = [];

    for (let settled of settledData) {
        //console.log('settled?', settled.status, settled);
        if (settled.status === 'fulfilled' && settled.value !== undefined) {
            for(let item of settled.value) {
                // Be extra careful in case the unofficial API starts returning junk
                const parsed = RMPSearchResult.safeParse(item?.node);
                //console.log('parsed?', parsed);
                if (parsed.success) {
                    result.push(parsed.data);
                }
            }
        }
    }

    return result;
}
