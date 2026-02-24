//
// Adapted from:
// https://validator.w3.org/feed/docs/atom.html
//

import { z } from 'zod';
import { AtomCategory, AtomLink, AtomPerson, AtomText } from './AtomCommon';
import { AtomEntry } from './AtomEntry';

/**
 * Identifies the software used to generate the feed, for debugging and other purposes. Both the `uri` and `version` attributes are optional.
 */
export type AtomGenerator = z.infer<typeof AtomGenerator>;
export const AtomGenerator = z.object({
  value: z.string(),
  uri: z.string().optional(),
  version: z.string().optional(),
});

/** A Feed consists of some metadata, followed by any number of entries.  */
export type AtomFeed = z.infer<typeof AtomFeed>;
export const AtomFeed = z.object({
  /** Identifies the feed using a universally unique and permanent URI. If you have a long-term, renewable lease on your Internet domain name, then you can feel free to use your website's address. */
  id: z.string(),
  /** Contains a human readable title for the feed. Often the same as the title of the associated website. This value should not be blank. */
  title: AtomText,
  /** Indicates the last time the feed was modified in a significant way. */
  updated: z.instanceof(Date),
  /** The entries within the feed */
  entries: z.array(AtomEntry),
  /** Names one author of the feed. A feed may have multiple author elements. A feed must contain at least one author element unless all of the entry elements contain at least one author element. */
  author: z.array(AtomPerson).optional(),
  /** Identifies a related Web page. The type of relation is defined by the rel attribute. A feed is limited to one alternate per type and hreflang. A feed should contain a link back to the feed itself. */
  link: z.array(AtomLink).optional(),
  /** Specifies a category that the feed belongs to. A feed may have multiple category elements. */
  category: z.array(AtomCategory).optional(),
  /** Names one contributor to the feed. An feed may have multiple contributor elements. */
  contributor: z.array(AtomPerson).optional(),
  /** Identifies the software used to generate the feed, for debugging and other purposes. Both the `uri` and `version` attributes are optional. */
  generator: AtomGenerator.optional(),
  /** Identifies a small image which provides iconic visual identification for the feed. Icons should be square. */
  icon: z.string().optional(),
  /** Identifies a larger image which provides visual identification for the feed. Images should be twice as wide as they are tall. */
  logo: z.string().optional(),
  /** Conveys information about rights, e.g. copyrights, held in and over the feed. */
  rights: AtomText.optional(),
  /** Contains a human-readable description or subtitle for the feed. */
  subtitle: z.string().optional(),
});
