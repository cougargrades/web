
import { z } from 'zod'

export type RankingResult = z.infer<typeof RankingResult>
export const RankingResult = z.object({
  /**
   * The actual integer ranking
   */
  rank: z.number().int(),
  /**
   * The "score" (generic term) that earned the "thing" this rank
   */
  score: z.number(),
})

