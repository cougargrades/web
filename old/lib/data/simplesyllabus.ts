import { Temporal } from 'temporal-polyfill'

export const SYLLABUS_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ days: 7 });

/**
 * Thumbnail URLs: https://uh.simplesyllabus.com/api2/doc-png/{{ doc_code }}
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/api2/doc-png/zb2x5hwht
 */
export function getThumbnailUrl(docCode: string) {
    return `https://uh.simplesyllabus.com/api2/doc-png/${docCode}`
}

/**
 * Syllabus PDFs: https://uh.simplesyllabus.com/api2/doc-pdf/{{ doc_code }}/{{ any file name you want}}.pdf?locale=en-US
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/api2/doc-pdf/megwtcr68/megwtcr68.pdf?locale=en-US
 */
export function getPDFDocumentUrl(docCode: string) {
    return `https://uh.simplesyllabus.com/api2/doc-pdf/${docCode}/${docCode}.pdf?locale=en-US`
}

/**
 * Syllabus HTML: https://uh.simplesyllabus.com/api2/doc-html/{{ doc_code }}/{{ any file name you want}}.html?locale=en-US
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/api2/doc-html/megwtcr68/megwtcr68.html?locale=en-US
 */
export function getEmbeddableHTMLUrl(docCode: string) {
    return `https://uh.simplesyllabus.com/api2/doc-html/${docCode}/${docCode}?locale=en-US`
}

/**
 * Document view URLs: https://uh.simplesyllabus.com/doc/{{ doc_code }}?mode=view
 * 
 * Where {{ doc_code }} is a document code (the unique identifier for a specific syllabus)
 * Ex: https://uh.simplesyllabus.com/doc/megwtcr68?mode=view
 */
export function getDocumentViewUrl(docCode: string) {
    return `https://uh.simplesyllabus.com/doc/${docCode}?mode=view`
}

export function getSearchResultsUrl(query: string) {
    return `https://uh.simplesyllabus.com/en-US/syllabus-library?search=${encodeURIComponent(query)}`;
}
