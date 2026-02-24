
import DOMPurify from 'dompurify'
import { is } from '@cougargrades/utils/zod'
import { AtomCategory, AtomContent, AtomLink, AtomLinkRelType, AtomPerson, AtomText, AtomTextType } from './AtomCommon';
import { AtomEntry, AtomSource } from './AtomEntry';
import { AtomFeed } from './AtomFeed';

/** searches for a tag in the node list, prevents recursive searches */
const findByTag = (nodes: Iterable<Element> | ArrayLike<Element> | HTMLCollection, tagName: string) => Array.from(nodes).find(e => e.nodeName === tagName);
/** searches for nodes which have a matching tagName, prevents recursive searches */
const filterByTag = (nodes: Iterable<Element> | ArrayLike<Element> | HTMLCollection, tagName: string) => Array.from(nodes).filter(e => e.nodeName === tagName);
/** shortcut method for `findByTag()` that accesses children */
const findChildTag = (parent: Document | Element, tagName: string) => findByTag(parent.children, tagName);
/** shortcut method for `filterByTag()` that accesses children */
const filterChildTags = (parent: Document | Element, tagName: string) => filterByTag(parent.children, tagName);


/** parses the feed */
export function parseAtomFeed(data: string): AtomFeed {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');
  const feed = findChildTag(xml, 'feed');
  if(feed) {
    return {
      id: sanitizeTextContent(findChildTag(feed, 'id')) ?? '',
      title: parseAtomText(findChildTag(feed, 'title')),
      updated: new Date(findChildTag(feed, 'updated')?.textContent ?? 0),
      entries: filterChildTags(feed, 'entry').map(e => parseAtomEntry(e)).sort((a, b) => (b.updated.valueOf() - a.updated.valueOf())), // earliest are first
      author: filterChildTags(feed, 'author').map(author => parseAtomPerson(author)),
      link: filterChildTags(feed, 'link').map(link => parseAtomLink(link)),
      category: filterChildTags(feed, 'category').map(category => parseAtomCategory(category)),
      contributor: filterChildTags(feed, 'contributor').map(contributor => parseAtomPerson(contributor)),
      generator: {
        value: sanitizeTextContent(findChildTag(feed, 'generator')) ?? '',
        uri: sanitizeTextAttribute(findChildTag(feed, 'generator'), 'uri'),
        version: sanitizeTextAttribute(findChildTag(feed, 'generator'), 'version'),
      },
      icon: sanitizeTextContent(findChildTag(feed, 'icon')),
      logo: sanitizeTextContent(findChildTag(feed, 'logo')),
      rights: parseAtomText(findChildTag(feed, 'rights')),
      subtitle: sanitizeTextContent(findChildTag(feed, 'subtitle')),
    };
  }
  throw Error('No <feed> tag found.');
}

export function parseAtomEntry(entry: Element): AtomEntry {
  return {
    id: sanitizeTextContent(findChildTag(entry, 'id')) ?? '',
    title: parseAtomText(findChildTag(entry, 'title')),
    updated: new Date(findChildTag(entry, 'updated')?.textContent ?? 0),
    author: filterChildTags(entry, 'author').map(author => parseAtomPerson(author)),
    content: parseAtomContent(findChildTag(entry, 'content')),
    link: filterChildTags(entry, 'link').map(link => parseAtomLink(link)),
    summary: parseAtomText(findChildTag(entry, 'summary')),
    category: filterChildTags(entry, 'category').map(category => parseAtomCategory(category)),
    contributor: filterChildTags(entry, 'contributor').map(contributor => parseAtomPerson(contributor)),
    published: findChildTag(entry, 'published') ? new Date(findChildTag(entry, 'published')?.textContent ?? 0) : undefined,
    rights: parseAtomText(findChildTag(entry, 'rights')),
    source: parseAtomSource(findChildTag(entry, 'source')),
  };
}

/** safely decode text content */
export function safelyDecodeAtomText(type: AtomTextType | undefined, element: Element | undefined): string {
  if(element !== undefined) {
    // If type="xhtml", then this element contains inline xhtml, wrapped in a div element.
    // This means that the existing `.innerHTML` is ready to be santized
    if(type === 'xhtml') return DOMPurify.sanitize(element.innerHTML);
    // If type="html", then this element contains entity escaped html.
    // using `.textContent` will un-escape the text
    else if(type === 'html') return DOMPurify.sanitize(element.textContent ?? '');
    // If type="text", then this element contains plain text with no entity escaped html.
    // This means that the content of `.innerHTML` are **intended** to be safe.
    // However, we don't want to leave an attack vector open, so we're going to sanitize it anyway.
    else if(type === 'text') return DOMPurify.sanitize(element.innerHTML);
    else return DOMPurify.sanitize(element.textContent ?? '');
  }
  return '';
}

/** shortcut for safely decoding the `.textContent` value of an element */
export function sanitizeTextContent(element: Element | undefined): string | undefined { 
  return element !== undefined ? DOMPurify.sanitize(element.textContent ?? '') : undefined;
}

/** shortcut for safely decoding the an attribute value of an element */
export function sanitizeTextAttribute(element: Element | undefined, attributeName: string): string | undefined  {
  if(element !== undefined) {
    let attr: string | null;
    if((attr = element.getAttribute(attributeName)) !== null) {
      return attr;
    }
  }
  return undefined;
}

export function parseAtomContent(content: Element | undefined): AtomContent {
  const rawType = sanitizeTextAttribute(content, 'type');
  const type = is(rawType, AtomTextType) ? rawType : undefined; 
  return {
    type,
    src: sanitizeTextAttribute(content, 'src'),
    value: safelyDecodeAtomText(type, content),
  }
}


export function parseAtomText(text: Element | undefined): AtomText {
  const rawType = sanitizeTextAttribute(text, 'type');
  const type = is(rawType, AtomTextType) ? rawType : undefined; 
  return {
    type,
    value: safelyDecodeAtomText(type, text)
  }
}

export function parseAtomPerson(person: Element): AtomPerson {
  return {
    name: DOMPurify.sanitize(findChildTag(person, 'name')?.textContent ?? ''),
    uri: sanitizeTextContent(findChildTag(person, 'uri')),
    email: sanitizeTextContent(findChildTag(person, 'email')),
  }
}

export function parseAtomLink(link: Element): AtomLink {
  const rawRel = sanitizeTextAttribute(link, 'rel');
  return {
    href: sanitizeTextAttribute(link, 'href') ?? '',
    rel: is(rawRel, AtomLinkRelType) ? rawRel : undefined,
    type: sanitizeTextAttribute(link, 'type'),
    hreflang: sanitizeTextAttribute(link, 'hreflang'),
    title: sanitizeTextAttribute(link, 'title'),
    length: sanitizeTextAttribute(link, 'length'),
  };
}

export function parseAtomCategory(category: Element): AtomCategory {
  return {
    term: sanitizeTextAttribute(category, 'term') ?? '',
    scheme: sanitizeTextAttribute(category, 'scheme') ?? undefined,
    label: sanitizeTextAttribute(category, 'label') ?? undefined
  };
}

export function parseAtomSource(source: Element | undefined): AtomSource | undefined {
  if(source !== undefined) {
    return {
      id: sanitizeTextContent(findChildTag(source, 'id')) ?? '',
      title: sanitizeTextContent(findChildTag(source, 'title')) ?? '',
      updated: new Date(findChildTag(source, 'title')?.textContent ?? 0)
    };
  }
  return undefined;
}
