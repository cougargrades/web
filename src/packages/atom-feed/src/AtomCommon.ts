
import { z } from 'zod'

//
// Adapted from:
// https://validator.w3.org/feed/docs/atom.html
//

/**
 * &lt;title&gt;, &lt;summary&gt;, &lt;content&gt;, and &lt;rights&gt; contain human-readable text, usually in small quantities. The type attribute determines how this information is encoded (default="text")
 * - If `type="text"`, then this element contains plain text with no entity escaped html.
 * - If `type="html"`, then this element contains entity escaped html.
 * - If `type="xhtml"`, then this element contains inline xhtml, wrapped in a div element.
 */
export type AtomTextType = z.infer<typeof AtomTextType>;
export const AtomTextType = z.enum(['text', 'html', 'xhtml']);


/** representation of &lt;category&gt; element */
export type AtomCategory = z.infer<typeof AtomCategory>;
export const AtomCategory = z.object({
  /** identifies the category */
  term: z.string(),
  /** identifies the categorization scheme via a URI. */
  scheme: z.string().optional(),
  /** provides a human-readable label for display */
  label: z.string().optional(),
});

/**
 * &lt;content&gt; either contains, or links to, the complete content of the entry.
 * In the most common case, the `type` attribute is either `text`, `html`, `xhtml`, in which case the content element is defined identically to other text constructs, which are described here.
 * Otherwise, if the `src` attribute is present, it represents the URI of where the content can be found. The `type` attribute, if present, is the media type of the content.
 * Otherwise, if the `type` attribute ends in `+xml` or `/xml`, then an xml document of this type is contained inline.
 * Otherwise, if the `type` attribute starts with `text`, then an escaped document of this type is contained inline.
 * Otherwise, a base64 encoded document of the indicated media type is contained inline.
 */
export type AtomContent = z.infer<typeof AtomContent>;
export const AtomContent = z.object({
  type: AtomTextType.optional(),
  src: z.string().optional(),
  /** the value stored here should be safe, unescaped HTML that can be put anywhere */
  value: z.string(),
});


/**
 * `rel` contains a single link relationship type. It can be a full URI (see extensibility), or one of the following predefined values (default=`alternate`):
 * - `alternate`: an alternate representation of the entry or feed, for example a permalink to the html version of the entry, or the front page of the weblog.
 * - `enclosure`: a related resource which is potentially large in size and might require special handling, for example an audio or video recording.
 * - `related`: an document related to the entry or feed.
 * - `self`: the feed itself.
 * - `via`: the source of the information provided in the entry.
 */
export type AtomLinkRelType = z.infer<typeof AtomLinkRelType>;
export const AtomLinkRelType = z.enum(['alternate', 'enclosure', 'related', 'self', 'via']);


/**
 * <link> is patterned after html's link element. It has one required attribute, `href`, and five optional attributes: `rel`, `type`, `hreflang`, `title`, and `length`.
 */
export type AtomLink = z.infer<typeof AtomLink>;
export const AtomLink = z.object({
  /** `href` is the URI of the referenced resource (typically a Web page) */
  href: z.string(),
  /**
   * rel contains a single link relationship type. It can be a full URI (see extensibility), or one of the following predefined values (default=`alternate`):
   * - `alternate`: an alternate representation of the entry or feed, for example a permalink to the html version of the entry, or the front page of the weblog.
   * - `enclosure`: a related resource which is potentially large in size and might require special handling, for example an audio or video recording.
   * - `related`: an document related to the entry or feed.
   * - `self`: the feed itself.
   * - `via`: the source of the information provided in the entry.
   */
  rel: AtomLinkRelType.optional(),
  /** `type` indicates the media type of the resource. */
  type: z.string().optional(),
  /** `hreflang` indicates the language of the referenced resource. */
  hreflang: z.string().optional(),
  /** `title`, human readable information about the link, typically for display purposes. */
  title: z.string().optional(),
  /** `length`, the length of the resource, in bytes. */
  length: z.string().optional(),
});

/** describes a person, corporation, or similar entity.  */
export type AtomPerson = z.infer<typeof AtomPerson>;
export const AtomPerson = z.object({
  /** conveys a human-readable name for the person. */
  name: z.string(),
  /** contains a home page for the person. */
  uri: z.string().optional(),
  /** contains an email address for the person. */
  email: z.string().optional(),
});

/**
 * &lt;title&gt;, &lt;summary&gt;, &lt;content&gt;, and &lt;rights&gt; contain human-readable text, usually in small quantities. The type attribute determines how this information is encoded (default="text")
 * - If `type="text"`, then this element contains plain text with no entity escaped html.
 * - If `type="html"`, then this element contains entity escaped html.
 * - If `type="xhtml"`, then this element contains inline xhtml, wrapped in a div element.
 */
export type AtomText = z.infer<typeof AtomText>;
export const AtomText = z.object({
  type: AtomTextType.optional(),
  value: z.string(),
});

