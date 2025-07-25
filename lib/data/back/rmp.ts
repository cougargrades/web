
import { z } from 'zod/v4'
import type * as z4 from 'zod/v4/core'
import { UH_RMP_SCHOOL_IDS } from '../rmp'

export type RMPSearchResult = z.infer<typeof RMPSearchResult>
export type RMPRankedSearchResult = RMPSearchResult & { _searchScore: number; };
export const RMPSearchResult = z.object({
    id: z.string(),
    legacyId: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    department: z.string(),
    //avgRating: z.number(), // Deprecated
    avgRatingRounded: z.number(),
    numRatings: z.number(),
    //wouldTakeAgainPercent: z.number(), // Deprecated
    wouldTakeAgainPercentRounded: z.number(),
    //avgDifficulty: z.number(), // Deprecated
    avgDifficultyRounded: z.number(),
    school: z.object({
        id: z.string(),
        legacyId: z.number(),
        name: z.string(),
        city: z.string(),
        state: z.string(),
    })
})

/**
 * Search for a professor at all UH campuses (deduplicated responses)
 * @param filter 
 * @returns 
 */
export async function search(filter: string): Promise<RMPSearchResult[]> {
    // Search all different campuses concurrently
    const settledData = await Promise.allSettled(UH_RMP_SCHOOL_IDS.map(schoolID => searchProfessorBySchoolID(filter, schoolID)));
    const seenTeacherIDs = new Set<string>();
    const result: RMPSearchResult[] = [];
    
    // Iterate over the search of each school
    for (let settled of settledData) {
        // Check if the request AND parse was successful
        if (settled.status === 'fulfilled' && settled.value !== undefined && settled.value.success) {
            // Iterate over every item in the GQL response
            for(let item of settled.value.data.data.search.teachers.edges) {
                // Prevent a teacher from being in the aggregate response twice
                if (!seenTeacherIDs.has(item.node.id)) {
                    seenTeacherIDs.add(item.node.id);
                    result.push(item.node);
                }
            }
        }
        else {
            console.warn(`[rmp] RMP Search failed for \`${filter}\` for ${JSON.stringify(UH_RMP_SCHOOL_IDS)}:`, settled);
        }
    }

    return result;
}

export type RMPSearchResponse = z.infer<typeof RMPSearchResponse>
export const RMPSearchResponse = z.object({
    data: z.object({
        search: z.object({
            teachers: z.object({
                edges: z.object({
                    node: RMPSearchResult,
                }).array()
            })
        })
    })
})

export async function searchProfessorBySchoolID(filter: string, schoolID: string, limit: number = 8) {
    return await graphql(RMPSearchResponse, {
        query: {
            text: filter,
            schoolID: schoolID,
            fallback: true
        },
        first: limit,
    }, `
query TeacherSearchResultsPageQuery(
  $query: TeacherSearchQuery!,
  $first: Int
) {
  search: newSearch {
    teachers(query: $query, first: $first, after: "") {
      didFallback
      edges {
        cursor
        node {
          __typename  
          id
          legacyId
          firstName
          lastName
          department
          #avgRating # deprecated
          avgRatingRounded
          numRatings
          #wouldTakeAgainPercent # deprecated
          wouldTakeAgainPercentRounded
          #avgDifficulty # deprecated
          avgDifficultyRounded
          school {
            id
            legacyId
            name
            city
            state
            country
          }
          isSaved
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      resultCount
    }
  }
}
`)
}

// #region GraphQL stuff

/**
 * To explore this and know what fields to fetch, the tool below is a GODSEND.
 * 
 * GraphQL Explorer: https://explorer.inigo.io/
 * 
 */
const RMP_GRAPHQL_BASE = 'https://www.ratemyprofessors.com/graphql';

/**
 * This executes a GraphQL query and parses the response against a provided Zod type.
 * 
 * It also allows the shared function to be type safe, despite accepting any query and any Zod schema.
 * 
 * @param zodSchema 
 * @param body 
 * @returns 
 */
export async function graphql<T extends z4.$ZodType>(zodSchema: T, variables: { [key: string]: any }, query: string): Promise<z.ZodSafeParseResult<z4.output<T>>> {
    const res = await fetch(RMP_GRAPHQL_BASE, {
        /**
         * This appears to be all that is necessary.
         * No cookies or headers or junk.
         * 
         * Odd...
         * 
         * If that changes, this is where we'd do it.
         */
        method: 'POST',
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    })

    if (!res.ok) {
        throw new Error('Network response from RMP not OK', { cause: res });
    }

    const data = await res.json();
    const parsed = z.safeParse(zodSchema, data);
    if (!parsed.success) {
        console.warn(`[rmp] Parse of response failed: `, data);
    }
    return parsed;
}

// #endregion


