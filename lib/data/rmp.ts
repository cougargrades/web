import type { RMPSearchResult } from './back/rmp'

// On RMP, UH has different campuses listed that are part of the same university (not just the "UH System")
export const UH_RMP_SCHOOL_IDS = [
    'U2Nob29sLTExMDk=', // "University of Houston" = https://www.ratemyprofessors.com/school/1109
    'U2Nob29sLTE3NjU2', // "University of Houston - Katy" = https://www.ratemyprofessors.com/school/17656
    'U2Nob29sLTE5MDIx', // "University of Houston - Sugarland" = https://www.ratemyprofessors.com/school/19021
    'U2Nob29sLTE4MTcw', // "University of Houston College of Nursing" = https://www.ratemyprofessors.com/school/18170
]

export function getRMPSchoolViewableUrl(rmpLegacyId: string): string {
    return `https://www.ratemyprofessors.com/school/${rmpLegacyId}`
}

export function getRMPProfessorViewableUrl(rmpLegacyId: string): string {
    return `https://www.ratemyprofessors.com/professor/${rmpLegacyId}`
}

export function getRMPProfessorSearchUrl(query: string): string {
    return `https://www.ratemyprofessors.com/search/professors/?q=${encodeURIComponent(query)}`
}

