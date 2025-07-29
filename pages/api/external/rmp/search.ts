// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { TEMPORAL_CACHE_CONTROL } from '../../../../lib/cache'
import * as rmp from '../../../../lib/data/back/rmp'
import { RMP_CACHE_LIFETIME} from '../../../../lib/data/rmp'
import type { RMPRankedSearchResult } from '../../../../lib/data/back/rmp'
import { extract } from '../../../../lib/util'

import { diceCoefficient } from 'dice-coefficient'

export default async function SearchRMP(req: NextApiRequest, res: NextApiResponse<RMPRankedSearchResult[]>) {
  const { query, strict } = req.query;
  const searchTerm = extract(query);
  const SEARCH_STRICTLY = JSON.parse(extract(strict)) === true;

  // Query the RMP API
  let data = await rmp.search(searchTerm);
  
  // Augment the data we got with the search ranks
  let results: RMPRankedSearchResult[] = data.map(d => {
    /**
     * TODO: Is there a better way to do this?
     * We don't even use this score in the front-end
     * since `strict` searching is enabled by default.
     */
    let diceScore = diceCoefficient(searchTerm, `${d.firstName} ${d.lastName}`);

    return {
      ...d,
      _searchScore: diceScore,
    }
  });

  // Apply the "strict" option
  if (SEARCH_STRICTLY) {
    results = results.filter(item =>
      searchTerm.toLowerCase().includes(item.firstName.toLowerCase())
      && searchTerm.toLowerCase().includes(item.lastName.toLowerCase())
    )
  }

  // Sort the results
  results.sort((a,b) => b._searchScore - a._searchScore);

  res.setHeader('Cache-Control', TEMPORAL_CACHE_CONTROL(RMP_CACHE_LIFETIME));
  res.json(results);
}
