
// https://uh.simplesyllabus.com/api2/doc-library-search?search=ACCT%207337&term_statuses%5B%5D=future&term_statuses%5B%5D=current

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
    return await res.json();
}