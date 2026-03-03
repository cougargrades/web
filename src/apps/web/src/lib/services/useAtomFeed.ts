
import { useQuery } from '@tanstack/react-query'
import { parseAtomFeed } from '@cougargrades/atom-feed'

/**
 * The React hook used for reading the Atom feed.
 * @param feedURL The URL of the Atom feed
 * @returns The decoded Atom feed or any errors seen along the way
 */
export function useAtomFeed(feedURL: string) {
  const query = useQuery({
    queryKey: ['use-atom-feed', feedURL],
    queryFn: async () => {
      const res = await fetch(feedURL);
      const data = await res.text();
      const decoded = parseAtomFeed(data);
      return decoded;
    }
  })
  return query;
}
