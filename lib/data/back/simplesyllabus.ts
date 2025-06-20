import { z } from 'zod'

export const Example = z.object({
    hello: z.string()
})
export type Example = z.infer<typeof Example>


/**
 * https://uh.simplesyllabus.com/api2/doc-library-search?search=ACCT%207337&term_statuses%5B%5D=future&term_statuses%5B%5D=current
 */
export async function search(filter: string) {
    let query = new URLSearchParams([
        ['search', filter],
        ['term_statuses[]', 'future'],
        ['term_statuses[]', 'current'],
        ['term_statuses[]', 'historic']
    ])
    query.append('term_statuses[]', 'future');
    query.append('term_statuses[]', 'current');
    query.append('term_statuses[]', 'historic');
    const res = await fetch(`https://uh.simplesyllabus.com/api2/doc-library-search?${query}`)
    // TODO: create zod definitions and validate against them here
    return await res.json();
}

/**
 * https://uh.simplesyllabus.com/api2/doc-full-page-get?code=megwtcr68
 */
export async function getDocument(docCode: string) {
    let query = new URLSearchParams({
        code: docCode
    })
    const res = await fetch(`https://uh.simplesyllabus.com/api2/doc-full-page-get?${query}`)
    // TODO: create zod definitions and validate against them here
    return await res.json();
}

/**
 * Thumbnail URLs: https://uh.simplesyllabus.com/api2/doc-png/{{ doc_code }}
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/api2/doc-png/zb2x5hwht
 */

/**
 * Syllabus PDFs: https://uh.simplesyllabus.com/api2/doc-pdf/{{ doc_code }}/{{ any file name you want}}.pdf?locale=en-US
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/api2/doc-pdf/megwtcr68/megwtcr68.pdf?locale=en-US
 */

/**
 * Syllabus HTML: https://uh.simplesyllabus.com/api2/doc-html/{{ doc_code }}/{{ any file name you want}}.html?locale=en-US
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/api2/doc-html/megwtcr68/megwtcr68.html?locale=en-US
 */

/**
 * Document view URLs: https://uh.simplesyllabus.com/doc/{{ doc_code }}?mode=view
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/doc/megwtcr68?mode=view
 */
